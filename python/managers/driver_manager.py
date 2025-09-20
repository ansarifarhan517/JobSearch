import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

class DriverManager:
    """
    Handles Chrome driver startup, profile selection, and attaching to existing Chrome instances.
    """

    def __init__(self, user_data_dir=None, profile_name="Default", headless=False, remote_debug_port=9222):
        self.user_data_dir = user_data_dir or os.path.expanduser(
            "~/Library/Application Support/Google/Chrome"
        )
        self.profile_name = profile_name
        self.headless = headless
        self.remote_debug_port = remote_debug_port
        self.driver = None
        self.wait = None

    def get_driver(self):
        """
        Returns a tuple (driver, wait) after starting or attaching to Chrome.
        """
        options = webdriver.ChromeOptions()
        options.add_argument(f"--user-data-dir={self.user_data_dir}")
        options.add_argument(f"--profile-directory={self.profile_name}")
        options.add_argument("--start-maximized")
        if self.headless:
            options.add_argument("--headless=new")

        # Try attach to existing Chrome
        attach_options = webdriver.ChromeOptions()
        attach_options.add_argument(f"--user-data-dir={self.user_data_dir}")
        attach_options.add_argument(f"--profile-directory={self.profile_name}")
        attach_options.add_experimental_option("debuggerAddress", f"127.0.0.1:{self.remote_debug_port}")

        try:
            self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=attach_options)
            print("✅ Attached to existing Chrome instance.")
        except Exception:
            print("⚠️ Chrome not running. Starting new instance.")
            options.add_argument(f"--remote-debugging-port={self.remote_debug_port}")
            options.add_experimental_option("detach", True)
            self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

        self.wait = WebDriverWait(self.driver, 20)
        return self.driver, self.wait
