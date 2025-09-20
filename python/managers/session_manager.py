import json
import os

class SessionManager:
    """
    Handles saving and loading cookies for different platforms.
    """
    PLATFORM_URLS = {
        "linkedin": "https://www.linkedin.com/feed/",
        "naukri": "https://www.naukri.com/",
        "indeed": "https://www.indeed.com/",
        # add more platforms here
    }

    def __init__(self, cookies_dir="state/cookies"):
        self.cookies_dir = cookies_dir
        os.makedirs(self.cookies_dir, exist_ok=True)

    def get_cookie_path(self, platform_name):
        """
        Returns the path to the cookies file for a given platform.
        """
        return os.path.join(self.cookies_dir, f"{platform_name}.cookies.json")

    def save_cookies(self, driver, platform_name):
        """
        Saves cookies from the current driver session to a file.
        """
        path = self.get_cookie_path(platform_name)
        cookies = driver.get_cookies()
        with open(path, "w") as f:
            json.dump(cookies, f, indent=2)
        print(f"✅ Saved cookies for {platform_name} at {path}")

    def load_cookies(self, driver, platform_name):
        cookies_path = self.get_cookie_path(platform_name)
        if not os.path.exists(cookies_path):
            return False

        with open(cookies_path, "r") as f:
            cookies = json.load(f)

        url = self.PLATFORM_URLS.get(platform_name.lower())
        if not url:
            raise ValueError(f"No URL defined for platform: {platform_name}")

        driver.get(url)
        for cookie in cookies:
            try:
                driver.add_cookie(cookie)
            except:
                continue
        driver.refresh()
        return True
