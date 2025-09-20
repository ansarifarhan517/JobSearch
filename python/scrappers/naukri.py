import time
import re
from urllib.parse import quote
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from managers.driver_manager import DriverManager
from managers.session_manager import SessionManager
from managers.config_manager import ConfigManager
from managers.result_manager import ResultManager


class NaukriScraper:
    def __init__(self):
        self.platform = "naukri"
        self.config_manager = ConfigManager(self.platform)
        self.config = self.config_manager.config
        self.platform_config = self.config_manager.get_platform_config(self.platform)

        self.email = self.platform_config.get("email")
        self.password = self.platform_config.get("password")
        self.titles_dict = self.config_manager.get_titles_dict()

        # Chrome profile
        self.user_data_dir = "~/Library/Application Support/Google/Chrome"
        self.profiles = ["Default"]

        # Managers
        self.driver_manager = None
        self.session_manager = SessionManager()
        self.result_manager = ResultManager()

        self.driver = None
        self.wait = None
        self.selected_profile = None

    # ---------------- Profile Selection ----------------
    def select_profile(self):
        self.selected_profile = self.profiles[0]

    # ---------------- Setup Driver ----------------
    def setup_driver(self):
        self.driver_manager = DriverManager(
            user_data_dir=self.user_data_dir,
            profile_name=self.selected_profile
        )
        self.driver, self.wait = self.driver_manager.get_driver()

    # ---------------- Robust Login ----------------
    def login(self):
        self.driver.get("https://www.naukri.com/nlogin/login")
        time.sleep(2)  # allow redirect to load

        # Attempt cookie login
        if self.session_manager.load_cookies(self.driver, self.platform):
            self.driver.refresh()
            try:
                self.wait.until(lambda d: "login" not in d.current_url)
                print("✅ Logged in via cookies.")
                return
            except TimeoutException:
                print("⚠️ Cookie login failed, manual login needed.")

        # Manual login
        try:
            username_input = self.wait.until(EC.visibility_of_element_located((By.ID, "usernameField")))
            password_input = self.wait.until(EC.visibility_of_element_located((By.ID, "passwordField")))

            username_input.clear()
            username_input.send_keys(self.email)
            password_input.clear()
            password_input.send_keys(self.password)
            password_input.send_keys(Keys.RETURN)

            self.wait.until(lambda d: "login" not in d.current_url)
            print("✅ Logged in manually.")

        except TimeoutException:
            print("⚠️ Login failed: fields not found or page structure changed.")

        # Save cookies for future sessions
        self.session_manager.save_cookies(self.driver, self.platform)

    # ---------------- Search Jobs ----------------
    def search_jobs(self):
        enabled_titles = [k for k, v in self.titles_dict.items() if v]
        if not enabled_titles:
            print("⛔ No job titles enabled in config.")
            return []

        search_keywords = "+".join(enabled_titles)
        search_url = f"https://www.naukri.com/{search_keywords}-jobs"
        self.driver.get(search_url)
        print(f"🔍 Searching jobs for '{', '.join(enabled_titles)}'...")

        results = []
        processed_jobs = set()
        page = 1

        while page <= 20 and len(results) < 100:
            time.sleep(2)

            # Scroll to load more jobs
            prev_height = self.driver.execute_script("return document.body.scrollHeight")
            while True:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == prev_height:
                    break
                prev_height = new_height

            # ---------------- Extract Job Cards ----------------
            try:
                job_cards = self.driver.find_elements(By.CSS_SELECTOR, ".jobTuple")
            except:
                print("⚠️ No job cards found on this page.")
                break

            for card in job_cards:
                try:
                    job_id = card.get_attribute("data-job-id")
                    if job_id in processed_jobs:
                        continue
                    processed_jobs.add(job_id)

                    # ---------------- Job Details ----------------
                    title = self._safe_text(card, ".title")
                    if not self._is_enabled_title(title):
                        continue

                    company = self._safe_text(card, ".companyInfo .subTitle")
                    loc = self._safe_text(card, ".location")
                    experience = self._safe_text(card, ".experience")
                    salary = self._safe_text(card, ".salary")
                    apply_link = self._safe_href(card, "a.title")
                    scrap_from = "NAUKRI"

                    print(f"{title} | {company} | {loc} | Exp: {experience} | Salary: {salary} | Apply: {apply_link}")
                    results.append([title, company, loc, experience, salary, apply_link, scrap_from])

                except Exception:
                    continue

            # ---------------- Next Page ----------------
            try:
                next_btn = self.driver.find_element(By.CSS_SELECTOR, "a[rel='next']")
                next_btn.click()
                page += 1
                print(f"➡️ Moving to page {page}...")
                time.sleep(3)
            except:
                print("⚠️ No more pages.")
                break

        return results

    # ---------------- Helpers ----------------
    def _safe_text(self, parent, selector):
        try:
            return parent.find_element(By.CSS_SELECTOR, selector).text.strip()
        except:
            return "N/A"

    def _safe_href(self, parent, selector):
        try:
            return parent.find_element(By.CSS_SELECTOR, selector).get_attribute("href") or "N/A"
        except:
            return "N/A"

    def _is_enabled_title(self, title):
        matched = False
        for known_title, enabled in self.titles_dict.items():
            if known_title.lower() in title.lower() and enabled:
                matched = True
                break
        if not matched and title not in self.titles_dict:
            print(f"⚠️ New title found: {title}, adding as false")
            self.titles_dict[title] = False
            self.config_manager.save_config()
        return matched

    # ---------------- Save Results ----------------
    def save_results(self, results):
        self.result_manager.save_to_csv(results)
        self.config_manager.save_config()

    # ---------------- Run ----------------
    def run(self):
        self.select_profile()
        self.setup_driver()
        self.login()
        results = self.search_jobs()
        if results:
            self.save_results(results)
