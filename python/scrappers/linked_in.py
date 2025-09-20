import time
import re
from urllib.parse import quote
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException

from managers.driver_manager import DriverManager
from managers.config_manager import ConfigManager
from managers.result_manager import ResultManager
import hashlib


class LinkedInScraper:
    def __init__(self):
        # --- Config ---
        self.platform = "linkedin"
        self.config_manager = ConfigManager(self.platform)
        self.config = self.config_manager.config
        self.platform_config = self.config_manager.get_platform_config(self.platform)

        self.email = self.platform_config.get("email")
        self.password = self.platform_config.get("password")
        self.location = self.platform_config.get("location")
        self.last_posted = self.platform_config.get("last_posted", "any")
        self.titles_dict = self.config_manager.get_titles_dict()

        last_posted_map = {
            "past_24h": "r86400",
            "past_week": "r604800",
            "past_month": "r2592000",
            "any": ""
        }
        self.f_TPR = last_posted_map.get(self.last_posted, "")

        # --- Chrome profiles ---
        self.user_data_dir = "~/Library/Application Support/Google/Chrome"
        self.profiles = ["Default"]  # fallback
        self.selected_profile = None

        # --- Managers ---
        self.driver_manager = None
        self.result_manager = ResultManager()

        # Selenium driver and wait
        self.driver = None
        self.wait = None

    # ---------------- Profile Selection ----------------
    def select_profile(self):
        print("Available Chrome profiles:")
        for idx, prof in enumerate(self.profiles):
            print(f"{idx + 1}. {prof}")

        selected_idx = input("Select a profile (leave blank for default): ").strip()
        if selected_idx.isdigit() and 1 <= int(selected_idx) <= len(self.profiles):
            self.selected_profile = self.profiles[int(selected_idx) - 1]
        else:
            self.selected_profile = self.profiles[0]

        print(f"⚠️ Using profile: {self.selected_profile}")

    # ---------------- Setup Driver ----------------
    def setup_driver(self):
        self.driver_manager = DriverManager(
            user_data_dir=self.user_data_dir,
            profile_name=self.selected_profile
        )
        self.driver, self.wait = self.driver_manager.get_driver()

    # ---------------- Ensure LinkedIn Tab ----------------
    def ensure_linkedin_tab(self):
        linkedin_tab_found = False
        for handle in self.driver.window_handles:
            self.driver.switch_to.window(handle)
            if 'linkedin.com' in self.driver.current_url:
                linkedin_tab_found = True
                print("✅ LinkedIn tab found, reusing existing tab.")
                break

        if not linkedin_tab_found:
            print("⚠️ LinkedIn tab not found. Opening new tab.")
            self.driver.execute_script("window.open('https://www.linkedin.com/feed/', '_blank');")
            self.driver.switch_to.window(self.driver.window_handles[-1])

    # ---------------- Handle Sign-in Modal ----------------
    def handle_signin_modal(self):
        """Check for LinkedIn contextual sign-in modal and log in if present."""
        try:
            header = self.wait.until(lambda d: d.find_element(By.CSS_SELECTOR, "h2.sign-in-modal__header"))
            if "Welcome back" in header.text:
                print("🔑 Sign-in modal detected, logging in...")

                email_input = self.driver.find_element(By.ID, "base-sign-in-modal_session_key")
                email_input.clear()
                email_input.send_keys(self.email)

                pwd_input = self.driver.find_element(By.ID, "base-sign-in-modal_session_password")
                pwd_input.clear()
                pwd_input.send_keys(self.password)

                signin_btn = self.driver.find_element(By.CSS_SELECTOR, "button.sign-in-form__submit-btn--full-width")
                signin_btn.click()

                self.wait.until(lambda d: "feed" in d.current_url or "jobs" in d.current_url)
                print("✅ Logged in via sign-in modal.")
                return True
        except Exception:
            pass
        return False

    # ---------------- Login ----------------
    def login(self):
        # Navigate to homepage first
        self.driver.get("https://www.linkedin.com/login")
        time.sleep(3)

        # Chrome profile cookies may auto-login
        current_url = self.driver.current_url
        if "feed" in current_url or "jobs" in current_url:
            print("✅ Logged in automatically via Chrome profile cookies.")
            return

        # Handle modal login
        if self.handle_signin_modal():
            return

        # Fallback manual login
        try:
            username_input = self.wait.until(lambda d: d.find_element(By.ID, "username"))
            username_input.clear()
            username_input.send_keys(self.email)

            pwd_input = self.driver.find_element(By.ID, "password")
            pwd_input.clear()
            pwd_input.send_keys(self.password + Keys.RETURN)

            self.wait.until(lambda d: "feed" in d.current_url or "jobs" in d.current_url)
            print("✅ Logged in manually.")
        except TimeoutException:
            print("⛔ Login failed. Please check credentials.")

    # ---------------- Search Jobs ----------------
    def search_jobs(self):
        enabled_titles = [k for k, v in self.titles_dict.items() if v]
        if not enabled_titles:
            print("⛔ No job titles enabled in config. Please set at least one title to true.")
            self.driver.quit()
            return []

        search_keywords = " OR ".join(enabled_titles)
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={quote(search_keywords)}&location={quote(self.location)}"
        if self.f_TPR:
            search_url += f"&f_TPR={self.f_TPR}"

        self.driver.get(search_url)

        # Handle modal if it appears during search
        self.handle_signin_modal()
        time.sleep(5)
        print(f"🔍 Searching jobs for '{', '.join(enabled_titles)}' in '{self.location}' with filter '{self.last_posted}'...")

        results = []
        processed_jobs = set()
        page = 1

        while len(results) < 100 and page <= 5:
            time.sleep(3)
            prev_height = self.driver.execute_script("return document.body.scrollHeight")
            while True:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == prev_height:
                    break
                prev_height = new_height

            try:
                job_cards = self.driver.find_elements(By.CSS_SELECTOR, "li[data-occludable-job-id]")
            except:
                print("⚠️ No job cards found on this page.")
                break

            for card in job_cards:
                if len(results) >= 100:
                    break
                try:
                    job_id = card.get_attribute("data-occludable-job-id")
                    if job_id in processed_jobs:
                        continue
                    processed_jobs.add(job_id)
                except:
                    continue

                try:
                    link = card.find_element(By.CSS_SELECTOR, "a.job-card-container__link")
                    self.driver.execute_script("arguments[0].click();", link)
                    time.sleep(2)
                    self.wait.until(lambda d: d.find_element(By.CSS_SELECTOR, ".jobs-description__container"))
                except:
                    continue

                # ---------------- Extract Job Data ----------------
                try:
                    title = self.driver.find_element(By.CSS_SELECTOR, ".job-details-jobs-unified-top-card__job-title h1").text.strip()
                except:
                    title = "N/A"

                matched = False
                for known_title in list(self.titles_dict.keys()):
                    if known_title.lower() in title.lower() and self.titles_dict[known_title]:
                        matched = True
                        break

                if not matched:
                    if title not in self.titles_dict:
                        print(f"⚠️ New title found: {title}, adding to config as false")
                        self.titles_dict[title] = False
                        self.config_manager.save_config()
                    continue

                try:
                    company = self.driver.find_element(By.CSS_SELECTOR, ".job-details-jobs-unified-top-card__company-name").text.strip()
                except:
                    company = "N/A"

                try:
                    loc = self.driver.find_element(By.CSS_SELECTOR, ".job-details-jobs-unified-top-card__primary-description-container").text.strip().split("·")[0].strip()
                except:
                    loc = "N/A"

                try:
                    footer_elems = card.find_elements(By.CSS_SELECTOR, ".job-card-list__footer-wrapper li")
                    footer = " | ".join([elem.text.strip() for elem in footer_elems if elem.text.strip()])
                except:
                    footer = "N/A"

                try:
                    easy_apply_button = self.driver.find_elements(By.CSS_SELECTOR, ".jobs-apply-button--top-card button")
                    easy_apply = "Yes" if easy_apply_button and "Easy Apply" in easy_apply_button[0].text else "No"
                except:
                    easy_apply = "N/A"

                apply_link = "N/A"
                if easy_apply == "No":
                    try:
                        external_btn = self.driver.find_element(By.CSS_SELECTOR, "a[data-control-name='jobdetails_topcard_inapply']")
                        apply_link = external_btn.get_attribute("href") or "N/A"
                    except:
                        apply_link = "N/A"

                try:
                    job_type_buttons = self.driver.find_elements(By.CSS_SELECTOR, ".job-details-fit-level-preferences button")
                    job_type = job_type_buttons[1].text.strip() if len(job_type_buttons) > 1 else "N/A"
                except:
                    job_type = "N/A"

                try:
                    description = self.driver.find_element(By.CSS_SELECTOR, ".jobs-description__container").text.strip()
                except:
                    description = "N/A"

                experience = "N/A"
                exp_match = re.search(r'(\d+)\+?\s*(?:year|yr)[s]?', description, re.IGNORECASE)
                if exp_match:
                    experience = exp_match.group(1) + " years"

                salary = "N/A"
                try:
                    salary_elem = self.driver.find_element(By.CSS_SELECTOR, ".jobs-unified-top-card__salary-info, .salary-compensation__text")
                    salary = salary_elem.text.strip()
                except:
                    sal_match = re.search(r'(\₹?\$?\d[\d,\.]+\s*(?:per\s*(month|year)|/year|/month)?)', description, re.IGNORECASE)
                    if sal_match:
                        salary = sal_match.group(1)

                scrap_from = "LINKEDIN"

                job_url = self.driver.current_url
                company_title_hash = hashlib.md5(f"{company}-{title}".encode("utf-8")).hexdigest()

                print(f"{title} | {company} | {loc} | {footer} | Easy Apply: {easy_apply} | Job Type: {job_type} | "
                      f"Exp: {experience} | Salary: {salary} | Apply Link: {apply_link} | Job ID: {job_id} | Job URL: {job_url}")
             
                results.append([
                    title, company, loc, footer, easy_apply, job_type,
                    description, experience, salary, apply_link,
                    scrap_from, job_id, job_url, company_title_hash
                ])
            # ---------------- Next Page ----------------
            if len(results) < 100 and page < 20:
                try:
                    next_button = self.wait.until(lambda d: d.find_element(By.CSS_SELECTOR, f"button[aria-label='Page {page + 1}']"))
                    self.driver.execute_script("arguments[0].click();", next_button)
                    page += 1
                    print(f"➡️ Moving to page {page}...")
                    time.sleep(5)
                except:
                    print("⚠️ No more pages available.")
                    break
            else:
                break

        return results

    # ---------------- Save Results ----------------
    def save_results(self, results):
        self.result_manager.save_to_csv(results)
        # self.config["titles"] = self.titles_dict
        # self.config_manager.save_config()

    # ---------------- Run ----------------
    def run(self):
        self.select_profile()
        self.setup_driver()
        self.ensure_linkedin_tab()
        self.login()
        results = self.search_jobs()
        if results:
            self.save_results(results)
