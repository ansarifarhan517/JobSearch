import time
import re
import random
from urllib.parse import quote
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options

# Uncomment the following if using 2Captcha
# from twocaptcha import TwoCaptcha

from managers.driver_manager import DriverManager
from managers.config_manager import ConfigManager
from managers.result_manager import ResultManager

from utility.logger import logger


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
        self.selected_profile = None

        # Managers
        self.driver_manager = None
        self.result_manager = ResultManager()

        self.driver = None
        self.wait = None

      
        logger.info("Initialized NaukriScraper.")

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
        logger.info(f"Selected Chrome profile: {self.selected_profile}")

    # ---------------- Setup Driver ----------------
    def setup_driver(self):
        options = Options()
        options.headless = False  # Disable headless mode to avoid bot detection
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        )
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_argument("--disable-blink-features=AutomationControlled")

        self.driver_manager = DriverManager(
            user_data_dir=self.user_data_dir,
            profile_name=self.selected_profile,
        )
        self.driver, self.wait = self.driver_manager.get_driver()
        logger.info("WebDriver initialized successfully.")

    # ---------------- Simulate Human Interaction ----------------
    def simulate_human_interaction(self):
        try:
            actions = ActionChains(self.driver)
            # Move mouse to a random position
            actions.move_by_offset(random.randint(100, 500), random.randint(100, 500)).perform()
            time.sleep(random.uniform(0.5, 2))
            logger.info("Simulated human interaction (mouse movement).")
        except Exception as e:
            print(f"⚠️ Failed to simulate human interaction: {e}")
            logger.error(f"Failed to simulate human interaction: {e}")

    # ---------------- Solve CAPTCHA (Optional) ----------------
    # def solve_captcha(self):
    #     solver = TwoCaptcha('YOUR_2CAPTCHA_API_KEY')
    #     try:
    #         result = solver.turnstile(
    #             sitekey='0x4AAAAAAADnPIDROrmt1Wwj',  # Replace with actual sitekey from iframe
    #             url='https://www.naukri.com/nlogin/login'
    #         )
    #         captcha_token = result['code']
    #         self.driver.execute_script(f"document.getElementById('cf-chl-widget-kmtfe_response').value = '{captcha_token}';")
    #         print("✅ CAPTCHA solved successfully.")
    #         logger.info("CAPTCHA solved successfully.")
    #         return True
    #     except Exception as e:
    #         print(f"⛔ Failed to solve CAPTCHA: {e}")
    #         logger.error(f"Failed to solve CAPTCHA: {e}")
    #         return False

    # ---------------- Robust Login ----------------
    def login(self):
        logger.info("Attempting to log in to Naukri.")
        self.driver.get("https://www.naukri.com/nlogin/login")
        time.sleep(random.uniform(2, 5))  # Allow redirect to load
    
        # Chrome profile cookies may auto-login
        current_url = self.driver.current_url
        if "homepage" in current_url or "jobs" in current_url:
            print("✅ Logged in automatically via Chrome profile cookies.")
            return
       
        # Check for Cloudflare CAPTCHA
        try:
            if "challenges.cloudflare.com" in self.driver.page_source:
                print("⚠️ Cloudflare CAPTCHA detected. Please complete the CAPTCHA manually.")
                logger.warning("Cloudflare CAPTCHA detected, prompting manual completion.")
                input("Press Enter after completing the CAPTCHA...")
                # Optionally uncomment to use 2Captcha
                # if not self.solve_captcha():
                #     print("⛔ CAPTCHA solving failed, please try manually.")
                #     input("Press Enter after completing the CAPTCHA...")
        except Exception as e:
            print(f"⚠️ Error checking for CAPTCHA: {e}")
            logger.error(f"Error checking for CAPTCHA: {e}")

        # Simulate human interaction
        self.simulate_human_interaction()

        # Manual login
        try:
            username_input = self.wait.until(
                EC.visibility_of_element_located((By.ID, "usernameField"))
            )
            password_input = self.wait.until(
                EC.visibility_of_element_located((By.ID, "passwordField"))
            )

            username_input.clear()
            username_input.send_keys(self.email)
            password_input.clear()
            password_input.send_keys(self.password)
            password_input.send_keys(Keys.RETURN)
            logger.info("Entered credentials and submitted login form.")

            self.wait.until(lambda d: "login" not in d.current_url)
            print("✅ Logged in manually.")
            logger.info("Logged in successfully manually.")

        except TimeoutException:
            print("⛔ Login failed: Timeout waiting for page to load.")
            logger.error("Login failed: Timeout waiting for page to load.")
        except NoSuchElementException as e:
            print(f"⛔ Login failed: Input fields not found - {e}")
            logger.error(f"Login failed: Input fields not found - {e}")
        except Exception as e:
            print(f"⛔ Unexpected login error: {e}")
            logger.error(f"Unexpected login error: {e}")

    # ---------------- Search Jobs ----------------
    def search_jobs(self):
        enabled_titles = [k for k, v in self.titles_dict.items() if v]
        if not enabled_titles:
            print("⛔ No job titles enabled in config.")
            logger.warning("No job titles enabled in config.")
            return []

        search_keywords = "+".join([quote(title.lower()) for title in enabled_titles])
        search_url = f"https://www.naukri.com/{search_keywords}-jobs"
        self.driver.get(search_url)
        time.sleep(random.uniform(3, 6))
        logger.info(f"Searching jobs with URL: {search_url}")

        print(f"🔍 Searching jobs for '{', '.join(enabled_titles)}'...")

        results = []
        processed_jobs = set()
        page = 1

        while page <= 20 and len(results) < 2:
            time.sleep(random.uniform(2, 4))

            # Scroll to load more jobs
            try:
                prev_height = self.driver.execute_script("return document.body.scrollHeight")
                while True:
                    self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(random.uniform(1, 3))
                    new_height = self.driver.execute_script("return document.body.scrollHeight")
                    if new_height == prev_height:
                        break
                    prev_height = new_height
                logger.info("Scrolled to load all job cards.")
            except Exception as e:
                print(f"⚠️ Error during scrolling: {e}")
                logger.error(f"Error during scrolling: {e}")

            # ---------------- Extract Job Cards ----------------
            try:
                job_cards = self.driver.find_elements(By.CSS_SELECTOR, ".srp-jobtuple-wrapper")

                logger.info(f"Found {len(job_cards)} job cards on page {page}.")
            except NoSuchElementException:
                print("⚠️ No job cards found on this page.")
                logger.warning("No job cards found on this page.")
                break

            for card in job_cards:
                try:
                    job_id = card.get_attribute("data-job-id")
                    if not job_id or job_id in processed_jobs:
                        continue
                    processed_jobs.add(job_id)

                    # ---------------- Job Details ----------------
                    title = self._safe_text(card, ".title")
                    if not self._is_enabled_title(title):
                        continue

                    company = self._safe_text(card, ".comp-name")
                    loc = self._safe_text(card, ".ni-job-tuple-icon-srp-location")
                    experience = self._safe_text(card, ".ni-job-tuple-icon-srp-experience")
                    salary = self._safe_text(card, ".salary")
                    apply_link = self._safe_href(card, "a.title")
                    scrap_from = "NAUKRI"

                    print(f"{title} | {company} | {loc} | Exp: {experience} | Salary: {salary} | Apply: {apply_link}")
                    logger.info(f"Scraped job: {title} | {company} | {loc}")

                    results.append([title, company, loc, experience, salary, apply_link, scrap_from])

                except Exception as e:
                    print(f"⚠️ Error processing job card: {e}")
                    logger.error(f"Error processing job card: {e}")
                    continue

            # ---------------- Next Page ----------------
            try:
                next_btn = self.wait.until(
                    EC.element_to_be_clickable(
                    (By.XPATH, "//a[contains(@class,'styles_btn-secondary__2AsIP') and span[text()='Next']]")
                )
                )
            
                next_btn_href = next_btn.get_attribute("href")
                if not next_btn_href:
                    print("⚠️ No more pages available.")
                    logger.info("No more pages available.")
                    break

                self.driver.execute_script("arguments[0].click();", next_btn)
                page += 1
                print(f"➡️ Moving to page {page}...")
                logger.info(f"Moving to page {page}.")
                time.sleep(random.uniform(3, 6))

            except (NoSuchElementException, TimeoutException):
                print("⚠️ No more pages available.")
                logger.info("No more pages available.")
                break


        return results

    # ---------------- Helpers ----------------
    def _safe_text(self, parent, selector):
        try:
            return parent.find_element(By.CSS_SELECTOR, selector).text.strip()
        except NoSuchElementException:
            return "N/A"

    def _safe_href(self, parent, selector):
        try:
            return parent.find_element(By.CSS_SELECTOR, selector).get_attribute("href") or "N/A"
        except NoSuchElementException:
            return "N/A"

    def _is_enabled_title(self, title):
        matched = False
        for known_title, enabled in self.titles_dict.items():
            if known_title.lower() in title.lower() and enabled:
                matched = True
                break
        if not matched and title not in self.titles_dict:
            print(f"⚠️ New title found: {title}, adding as false")
            logger.info(f"New title found: {title}, added to config as false")
            self.titles_dict[title] = False
            self.config_manager.save_config()
        return matched

    # ---------------- Save Results ----------------
    def save_results(self, results):
        self.result_manager.save_to_csv(results)
        self.config_manager.save_config()
        logger.info(f"Saved {len(results)} job listings to CSV.")

    # ---------------- Run ----------------
    def run(self):
        try:
            self.select_profile()
            self.setup_driver()
            self.login()
            results = self.search_jobs()
            if results:
                self.save_results(results)
        except Exception as e:
            print(f"⛔ Script failed: {e}")
            logger.error(f"Script failed: {e}")
        finally:
            if self.driver:
                self.driver.quit()
                logger.info("WebDriver closed.")