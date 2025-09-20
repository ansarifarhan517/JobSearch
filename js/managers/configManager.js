const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class ConfigManager {
    /**
     * Handles loading, updating, and saving configuration for scrapers.
     */
    constructor(platform) {
        this.configPath = path.resolve(__dirname,'../../' ,process.env.CONFIG_PATH);
        if (!this.configPath || !fs.existsSync(this.configPath)) {
            throw new Error(`Config Path not set or file does not exist: ${this.configPath}`);
        }
        this.config = this.loadConfig(platform);
    }

    loadConfig(platform) {
        /**
         * Load the config.json into memory.
         */
        const raw = fs.readFileSync(this.configPath, 'utf-8');
        const config = JSON.parse(raw);

        // Ensure platform section exists
        const platformConfig = config[platform] || {};

        // Override with environment variables if present
        platformConfig.email = process.env[`${platform.toUpperCase()}_EMAIL`];
        platformConfig.password = process.env[`${platform.toUpperCase()}_PASSWORD`];

        // Put the updated platform config back
        config[platform] = platformConfig;

        return config;
    }

    getPlatformConfig(platformName) {
        /**
         * Get configuration for a specific platform (e.g., linkedin, naukri).
         */
        return this.config[platformName] || {};
    }

    getTitlesDict() {
        /**
         * Get the dictionary of job titles (enabled/disabled) for all platforms.
         */
        return this.config.titles || {};
    }

    updateTitle(title, enabled = false) {
        /**
         * Add a new job title or update existing one.
         */
        if (!this.config.titles) {
            this.config.titles = {};
        }
        this.config.titles[title] = enabled;
    }

    saveConfig() {
        /**
         * Write the current config object back to config.json.
         */
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        console.log(`✅ Config saved to ${this.configPath}`);
    }
}

module.exports = ConfigManager;