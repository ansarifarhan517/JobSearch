const fs = require('fs');
const path = require('path');

class SessionManager {
    /**
     * Handles saving and loading cookies for different platforms.
     */
    static PLATFORM_URLS = {
        linkedin: "https://www.linkedin.com/feed/",
        naukri: "https://www.naukri.com/",
        indeed: "https://www.indeed.com/",
        // add more platforms here
    };

    constructor(cookiesDir = "state/cookies") {
        this.cookiesDir = cookiesDir;
        fs.mkdirSync(this.cookiesDir, { recursive: true });
    }

    getCookiePath(platformName) {
        /**
         * Returns the path to the cookies file for a given platform.
         */
        return path.join(this.cookiesDir, `${platformName}.cookies.json`);
    }

    async saveCookies(driver, platformName) {
        /**
         * Saves cookies from the current driver session to a file.
         */
        const filePath = this.getCookiePath(platformName);
        const cookies = await driver.manage().getCookies();
        fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));
        console.log(`✅ Saved cookies for ${platformName} at ${filePath}`);
    }

    async loadCookies(driver, platformName) {
        /**
         * Loads cookies from file and adds them to the browser session.
         */
        //GET THE ROOT DIRECTORY
        const cookiesPath = path.resolve(this.getCookiePath(platformName));
        if (!fs.existsSync(cookiesPath)) {
            return false;
        }

        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
        const url = SessionManager.PLATFORM_URLS[platformName.toLowerCase()];
        if (!url) {
            throw new Error(`No URL defined for platform: ${platformName}`);
        }

        await driver.get(url);
        for (const cookie of cookies) {
            try {
                await driver.manage().addCookie(cookie);
            } catch (err) {
                continue;
            }
        }
        await driver.navigate().refresh();
        return true;
    }
}

module.exports = SessionManager;