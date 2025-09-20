// minimal_public_hf_fetch_fixed.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const HF_API_TOKEN =  process.env.HF_API_TOKEN;
const MODEL = "gpt2"; // public model

async function run() {
    const payload = {
        inputs: "What is the capital of France?",
        parameters: { max_new_tokens: 50 }
    };

    try {
        const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HF API error ${res.status}: ${text}`);
        }

        const data = await res.json();

        // gpt2 returns { generated_text: "..." }
        if (data.generated_text) {
            console.log("HF response:", data.generated_text);
        } else if (Array.isArray(data)) {
            console.log("HF response:", data[0].generated_text);
        } else {
            console.log("HF raw response:", data);
        }

    } catch (err) {
        console.error("❌ HF call failed:", err.message);
    }
}

run();
