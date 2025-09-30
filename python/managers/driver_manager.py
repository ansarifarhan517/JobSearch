import os
import platform
import psutil
import tempfile
import time
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

class DriverManager:
    def __init__(self, user_data_dir=None, profile_name="Default", headless=False, enable_debugger=False):
        self.driver = None
        self.wait = None
        self.system_platform = platform.system()
        self.enable_debugger = enable_debugger
        self.headless = headless or self._detect_docker()
        self.profile_name = profile_name

        # Original Chrome profile
        self.user_data_dir = user_data_dir or os.path.expanduser(
            "~/Library/Application Support/Google/Chrome"
        )

        # Chrome binary (macOS only)
        self.chrome_binary = None
        if self.system_platform == "Darwin":
            mac_chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            if os.path.exists(mac_chrome_path):
                self.chrome_binary = mac_chrome_path

    def _detect_docker(self):
        try:
            if os.path.exists("/.dockerenv"):
                return True
            with open("/proc/1/cgroup", "rt") as f:
                return any(keyword in f.read() for keyword in ["docker", "kubepods", "containerd"])
        except:
            return False

    def _close_all_chrome(self):
        """Terminate all Chrome-related processes. Use with caution."""
        try:
            for proc in psutil.process_iter(['name']):
                if proc.info['name'] in ['chrome', 'chrome.exe', 'chromium', 'chromium-browser']:
                    proc.terminate()
                    try:
                        proc.wait(timeout=3)
                    except psutil.TimeoutExpired:
                        proc.kill()
        except Exception as e:
            print(f"⚠️ Could not close Chrome processes: {e}")
        time.sleep(1)

    def get_driver(self):
        options = webdriver.ChromeOptions()

        # Common flags
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-background-networking")
        options.add_argument("--disable-sync")
        options.add_argument("--disable-infobars")
        options.add_argument("--disable-popup-blocking")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--disable-software-rasterizer")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--start-maximized")
        options.add_argument("--crash-dumps-dir=/tmp")
        options.add_argument('--remote-debugging-pipe')
        options.add_argument("enable-automation")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--dns-prefetch-disable")
        options.add_argument("--disable-gpu")

        if self.headless:
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")

        if self.enable_debugger:
            options.add_argument("--remote-debugging-port=9222")

        # Profile handling
        if self._detect_docker():
            temp_profile = tempfile.mkdtemp()
            options.add_argument(f"--user-data-dir={temp_profile}")
        else:
            # Make a temporary copy of the selected profile
            profile_path = os.path.join(self.user_data_dir, self.profile_name)
            temp_profile = tempfile.mkdtemp()
            try:
                shutil.copytree(profile_path, os.path.join(temp_profile, self.profile_name), dirs_exist_ok=True)
            except Exception as e:
                print(f"⚠️ Could not copy profile, starting fresh: {e}")
            options.add_argument(f"--user-data-dir={temp_profile}")
            # Skip --profile-directory, since the copied profile is already isolated

        # Chrome binary
        if self.chrome_binary:
            options.binary_location = self.chrome_binary

        # Start Chrome
        driver_path = ChromeDriverManager().install()
        service = Service(driver_path)
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 20)

        print(f"✅ Chrome started (headless={self.headless}) {'inside Docker' if self._detect_docker() else 'on host'}")
        return self.driver, self.wait

    def quit(self):
        if self.driver:
            self.driver.quit()
            self.driver = None
            print("✅ Chrome driver quit successfully.")
