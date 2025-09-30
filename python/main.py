from scrappers.naukri import NaukriScraper
from scrappers.indeed import IndeedScraper
from utility.logger import logger
from scrappers.linked_in import LinkedInScraper
# from scrappers.naukri import NaukriScraper
from ai_agents.LinkedIn.filter_job_agent.filter_job_agent import extract_text_from_pdf, process_jobs
from ai_agents.LinkedIn.easy_apply_agent.easy_apply_agent import LinkedInAutoApply

# import PyPDF2
import os

def main():
    # logger.info("Info message")
    # logger.error("Error message")
    # logger.warning("Warning message")
    # logger.critical("Critical message")
    # USERNAME = os.getenv("LINKEDIN_EMAIL")
    # PASSWORD = os.getenv("LINKEDIN_PASSWORD")
    # print(f"Using LinkedIn Username: {USERNAME}")
    # print(f"Using LinkedIn Password: {PASSWORD}")



    # USERNAME = os.getenv("INDEED_EMAIL")
    # PASSWORD = os.getenv("INDEED_PASSWORD")

    USERNAME = os.getenv("NAUKRI_EMAIL")
    PASSWORD = os.getenv("NAUKRI_PASSWORD")
    print("🚀 Job Scraper Started")

    # Run LinkedIn Scraper
    linkedin = LinkedInScraper()
    linkedin.run()

    # # Run Indeed Scraper
    # indeed = IndeedScraper()
    # indeed.run()

    # Run Naukri Scraper
    # naukri = NaukriScraper()
    # naukri.run()

    print("✅ All scrapers finished.")

    # print("✅ LLM job filtering started.")

    # # --- Call LLM job filter agent ---
    # resume_path = os.path.abspath("Mohammad_Ansari_Resume_SDe.pdf")
    # job_postings_csv = os.path.abspath("job_results.csv")
    # output_file = os.path.abspath("filtered_jobs.csv")

    # # Extract resume text
    # resume_text = extract_text_from_pdf(resume_path)
    # # Call LLM agent to process jobs
    # process_jobs(resume_text, job_postings_csv, output_file)

    # print("✅ LLM job filtering finished.")

    # print("✅ Auto Apply started.")

    
    # auto_apply = LinkedInAutoApply(USERNAME, PASSWORD, filtered_csv="filtered_jobs.csv")
    # auto_apply.run()
    # print("✅ Auto Apply finished.")
   

if __name__ == "__main__":
    main()