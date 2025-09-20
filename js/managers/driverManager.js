const path = require('path');
const os = require('os');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class DriverManager {
    /**
     * Handles Chrome driver startup, profile selection, and attaching to existing Chrome instances.
     */
    constructor(userDataDir = null, profileName = 'Default', headless = false, remoteDebugPort = 9222) {
        this.userDataDir = userDataDir || path.join(os.homedir(), 'Library/Application Support/Google/Chrome');
        this.profileName = profileName;
        this.headless = headless;
        this.remoteDebugPort = remoteDebugPort;
        this.driver = null;
        this.waitTimeout = 20000;
    }

    async getDriver() {
        /**
         * Returns a driver instance after starting or attaching to Chrome.
         */
        let options = new chrome.Options();
        options.addArguments(`--user-data-dir=${this.userDataDir}`);
        options.addArguments(`--profile-directory=${this.profileName}`);
        options.addArguments('--start-maximized');
        if (this.headless) {
            options.addArguments('--headless=new');
        }

        // Try to attach to existing Chrome instance
        let attachOptions = new chrome.Options();
        attachOptions.addArguments(`--user-data-dir=${this.userDataDir}`);
        attachOptions.addArguments(`--profile-directory=${this.profileName}`);
        attachOptions.addArguments(`--remote-debugging-port=${this.remoteDebugPort}`);

        try {
            // Attach to existing Chrome (debuggerAddress)
            attachOptions.setChromeOptions({ debuggerAddress: `127.0.0.1:${this.remoteDebugPort}` });
            this.driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(attachOptions)
                .build();
            console.log('✅ Attached to existing Chrome instance.');
        } catch (err) {
            console.log('⚠️ Chrome not running. Starting new instance.');
            options.addArguments(`--remote-debugging-port=${this.remoteDebugPort}`);
            options.addArguments('--detach');
            this.driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();
        }

        return this.driver;
    }

    async waitUntilLocated(locator) {
        /**
         * Wait until an element is located.
         */
        return await this.driver.wait(until.elementLocated(locator), this.waitTimeout);
    }
}

module.exports = DriverManager;