const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { stringify } = require('csv-stringify/sync');
const { InferenceClient } = require('@huggingface/inference');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const MAX_PROMPT_CHARS = 4000;
const CALL_TIMEOUT_MS = 120000;

const client = new InferenceClient(process.env.HF_TOKEN);

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// --- CSV helpers ---
function readCsv(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', data => rows.push(data))
            .on('end', () => resolve(rows))
            .on('error', err => reject(err));
    });
}

function writeCsv(filePath, data) {
    const csvString = stringify(data, { header: true });
    fs.writeFileSync(filePath, csvString);
}

// --- Text helpers ---
function trimTextForPrompt(text, maxChars = MAX_PROMPT_CHARS) {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    const start = text.slice(0, Math.floor(maxChars * 0.6));
    const end = text.slice(-Math.floor(maxChars * 0.4));
    return `${start}\n\n...[TRUNCATED]...\n\n${end}`;
}

// --- Hugging Face call ---
async function callHuggingFace(systemPrompt, userPrompt) {
   try {
        const response = await client.chatCompletion({
           provider: "together",
    model: "Qwen/Qwen3-Next-80B-A3B-Thinking",
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 500,
            temperature: 0.2,
        });

        return response.choices[0].message.content.trim();
    } catch (err) {
        // throw the exact error message like HF would
        throw new Error(`Failed to perform inference: ${err.message}`);
    }
}

// --- Build prompts ---
function buildPrompts({ resumeText, job }) {
    const title = job.title || job.Title || '';
    const company = job.company || job.Company || '';
    const location = job.loc || job.Location || job.LocationRaw || '';
    const easyApply = job.easy_apply || job.EasyApply || job.easy_apply_flag || '';
    const description = job.description || job.Description || job.job_description || '';

    const rTrim = trimTextForPrompt(resumeText);
    const descTrim = trimTextForPrompt(description);

    const systemPrompt = `
You are a job filtering assistant. Compare a candidate's RESUME with a JOB POSTING.

Return ONLY one valid JSON object (no extra text, no explanations). Use exactly this schema:
{
  "match": "YES" or "NO",
  "reason": "One or two sentences why it matches or not.",
  "score": number // integer 0-100
}

Decision rules:
1. "YES" if resume has required or transferable skills.
2. "NO" if key skills/experience are missing.
3. Provide a numeric score (0–100) reflecting strength of match.
4. Output only valid JSON - nothing else.
`;

    const userPrompt = `
Candidate Resume:
${rTrim}

Job Posting:
Title: ${title}
Company: ${company}
Location: ${location}
Easy Apply: ${easyApply}
Description: ${descTrim}
`;

    return { systemPrompt, userPrompt };
}

// --- Parse model output ---
function parseModelOutput(output) {
    if (!output) return { match: 'NO', reason: 'No response from model', score: '' };

    try {
        const parsed = JSON.parse(output);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        return parsed;
    } catch (e) {
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {}
        }
        console.error("⚠️ JSON parse failed, raw output:", output);
        return { match: 'NO', reason: 'Invalid JSON response', score: '' };
    }
}


// --- Main function ---
async function filterJobsUsingResume(csvInputPath, csvOutputPath, resumeText) {
    const info = await client.listModels();
console.log(info, "Farhan");
    if (!fs.existsSync(csvInputPath)) throw new Error(`Input CSV not found: ${csvInputPath}`);
    if (!resumeText) throw new Error('Resume text is empty.');

    const jobs = await readCsv(csvInputPath);
    console.log(`🔎 ${jobs.length} jobs loaded.`);

    const outRows = [];
    let idx = 0;

    for (const job of jobs) {
        idx += 1;
        console.log(`\n[${idx}/${jobs.length}] Processing: ${job.title || job.Title || '(no title)'} - ${job.company || job.Company || ''}`);
        const { systemPrompt, userPrompt } = buildPrompts({ resumeText, job });

        let modelOutput = '';
        try {
            modelOutput = await callHuggingFace(systemPrompt, userPrompt);
        } catch (err) {
            console.error('❌ HF call failed:', err.message);
            outRows.push({
                ...job,
                match: 'NO',
                reason: `HF_ERROR: ${err.message}`,
                score: ''
            });
            await sleep(500);
            continue;
        }

        const parsed = parseModelOutput(modelOutput);

        const match = (parsed.match || '').toUpperCase() === 'YES' ? 'YES' : 'NO';
        const reason = parsed.reason || '';
        const score = Number.isFinite(Number(parsed.score)) ? Number(parsed.score) : '';

        outRows.push({ ...job, match, reason, score });
        await sleep(300);
    }

    writeCsv(csvOutputPath, outRows);
    console.log(`\n✅ Filtered jobs saved to: ${csvOutputPath}`);
}

module.exports = { filterJobsUsingResume };
