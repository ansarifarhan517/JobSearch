import json
import os
from dotenv import load_dotenv


class ConfigManager:
    """
    Handles loading, updating, and saving configuration for scrapers.
    """

    def __init__(self, platform):
        load_dotenv()
        self.config_path = os.getenv("CONFIG_PATH")
        
        if not self.config_path or not os.path.exists(self.config_path):
            raise FileNotFoundError(f"Config Path not set or file does not exist: {self.config_path}")
        
        self.config = self.load_config(platform)

     
    def load_config(self, platform):
        """
        Load the config.json into memory.
        """
        with open(self.config_path, "r") as f:
            config = json.load(f)

        # Ensure platform section exists
        platform_config = config.get(platform, {})

        # Override with environment variables if present
        platform_config["email"] = os.getenv(f"{platform.upper()}_EMAIL", platform_config.get("email", ""))
        platform_config["password"] = os.getenv(f"{platform.upper()}_PASSWORD", platform_config.get("password", ""))

        # Put the updated platform config back
        config[platform] = platform_config

        return config

    def get_platform_config(self, platform_name):
        """
        Get configuration for a specific platform (e.g., linkedin, naukri).
        """
        return self.config.get(platform_name, {})

    def get_titles_dict(self):
        """
        Get the dictionary of job titles (enabled/disabled) for all platforms.
        """
        return self.config.get("titles", {})

    def update_title(self, title, enabled=False):
        """
        Add a new job title or update existing one.
        """
        if "titles" not in self.config:
            self.config["titles"] = {}
        self.config["titles"][title] = enabled

    def save_config(self):
        """
        Write the current config object back to config.json.
        """
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=2)
        print(f"✅ Config saved to {self.config_path}")
