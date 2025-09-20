import os
import json
import pandas as pd
import fitz  # PyMuPDF
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env file
load_dotenv()
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),  # Put this in your .env file
)

def extract_text_from_pdf(pdf_path):
    """Extracts all text from a PDF file."""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text


def call_llm_bulk(prompts):
    """Send multiple prompts in one call (if your LLM supports batch)."""
    results = []
    for prompt in prompts:
        try:
            response = client.chat.completions.create(
                model="meta-llama/llama-4-maverick:free",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
            )
            results.append(response.choices[0].message.content.strip())
        except Exception as e:
            print("❌ LLM call error:", e)
            results.append("{}")  # fallback empty JSON
    return results


def safe_parse_json(text, job_title):
    """Try parsing JSON safely; return fallback dict on failure."""
    try:
        # Clean up common wrappers like ```json ... ```
        cleaned = text.strip()
        if cleaned.startswith("```"):
            # remove triple backticks and optional "json"
            cleaned = cleaned.strip("`").replace("json", "", 1).strip()
        
        return json.loads(cleaned)
    except Exception as e:
        print(f"⚠️ Error parsing JSON for job '{job_title}': {e}")
        print("🔎 Raw output:", repr(text))
        return {
            "Skills Matched": "",
            "Job Description Matched": "",
            "Work Experience Matched": "",
            "Reasoning": "",
            "Final Opinion": ""
        }

def process_jobs(resume_text, jobs_csv, output_csv):
    """Processes all jobs using LLM and saves annotated CSV."""
    jobs_df = pd.read_csv(jobs_csv)

    # Ensure columns exist and have proper dtype
    for col in ["Skills Matched", "Job Description Matched", "Work Experience Matched", "Reasoning", "Final Opinion"]:
        if col not in jobs_df.columns:
            jobs_df[col] = None
    jobs_df["Skills Matched"] = jobs_df["Skills Matched"].astype(object)
    jobs_df["Job Description Matched"] = jobs_df["Job Description Matched"].astype(object)
    jobs_df["Work Experience Matched"] = jobs_df["Work Experience Matched"].astype(object)
    jobs_df["Reasoning"] = jobs_df["Reasoning"].astype(object)
    jobs_df["Final Opinion"] = jobs_df["Final Opinion"].astype(object)

    # Prepare prompts
    prompts = []
    for _, row in jobs_df.iterrows():
        job_title = row.get('Job Title', '')
        job_desc = row.get('Job Description', '')
        prompt = f"""
You are a job matching assistant. 
Your ONLY task is to return a valid JSON object. Do not include any text before or after the JSON.

Resume:
\"\"\"{resume_text}\"\"\"

Job Posting:
Title: {job_title}
Description: {job_desc}

Return JSON in this **exact structure**:

{{
  "Skills Matched": ["skill1", "skill2"],
  "Job Description Matched": "yes" | "no" | "explanation",
  "Work Experience Matched": "yes" | "no" | "explanation",
  "Reasoning": "short reasoning why job is a good/bad match",
  "Final Opinion": number (1-10)
}}
"""
        prompts.append(prompt)

    # Call LLM
    llm_outputs = call_llm_bulk(prompts)

    # Parse outputs into a dict keyed by row index
    results = {
        idx: safe_parse_json(output, row.get('Job Title', ''))
        for output, (idx, row) in zip(llm_outputs, jobs_df.iterrows())
    }

    # Fill any missing rows
    for idx in jobs_df.index:
        result = results.get(idx, {})
        if not isinstance(result, dict):
            result = {}
        jobs_df.at[idx, "Skills Matched"] = json.dumps(result.get("Skills Matched", []))
        jobs_df.at[idx, "Job Description Matched"] = result.get("Job Description Matched", "")
        jobs_df.at[idx, "Work Experience Matched"] = result.get("Work Experience Matched", "")
        jobs_df.at[idx, "Reasoning"] = result.get("Reasoning", "")
        jobs_df.at[idx, "Final Opinion"] = result.get("Final Opinion", "")

    # Save annotated CSV
    jobs_df.to_csv(output_csv, index=False)
    print(f"✅ Output written to {output_csv}")
