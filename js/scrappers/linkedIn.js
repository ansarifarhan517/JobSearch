const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { URLSearchParams } = require("url");

// Placeholder managers (replace with your actual manager code)
const ConfigManager = require("../managers/configManager");
const DriverManager = require("../managers/driverManager");
const ResultManager = require("../managers/resultManager");

class LinkedInScraper {
  constructor() {
    // --- Config ---
    this.platform = "linkedin";
    this.configManager = new ConfigManager(this.platform);
    this.config = this.configManager.config;
    this.platformConfig = this.configManager.getPlatformConfig(this.platform);

    this.email = this.platformConfig.email;
    this.password = this.platformConfig.password;
    this.location = this.platformConfig.location;
    this.lastPosted = this.platformConfig.last_posted || "any";
    this.titlesDict = this.configManager.getTitlesDict();

    const lastPostedMap = {
      past_24h: "r86400",
      past_week: "r604800",
      past_month: "r2592000",
      any: "",
    };
    this.f_TPR = lastPostedMap[this.lastPosted] || "";

    // --- Chrome profiles ---
    this.userDataDir = path.join(process.env.HOME || "", "Library/Application Support/Google/Chrome");
    this.profiles = ["Default", "Profile 1", "Profile 2", "Profile 3", "Profile 4"];
    this.selectedProfile = null;

    // --- Managers ---
    this.driverManager = null;
    this.resultManager = new ResultManager();

    this.driver = null;
    this.waitTimeout = 15000;
  }

  // ---------------- Profile Selection ----------------
  async selectProfile() {
    console.log("Available Chrome profiles:");
    this.profiles.forEach((p, i) => console.log(`${i + 1}. ${p}`));
    // For simplicity, always select default
    this.selectedProfile = this.profiles[0];
    console.log(`⚠️ Using profile: ${this.selectedProfile}`);
  }

  // ---------------- Setup Driver ----------------
  async setupDriver() {
    const dm = new DriverManager(null, this.selectedProfile, 9222);
    const driver = await dm.getDriver();
    this.driver = driver;
  }

  // ---------------- Ensure LinkedIn Tab ----------------
  async ensureLinkedInTab() {
    const handles = await this.driver.getAllWindowHandles();
    let linkedinTabFound = false;
    for (const handle of handles) {
      await this.driver.switchTo().window(handle);
      const url = await this.driver.getCurrentUrl();
      if (url.includes("linkedin.com")) {
        linkedinTabFound = true;
        console.log("✅ LinkedIn tab found, reusing existing tab.");
        break;
      }
    }
    if (!linkedinTabFound) {
      console.log("⚠️ LinkedIn tab not found. Opening new tab.");
      await this.driver.executeScript("window.open('https://www.linkedin.com/feed/', '_blank');");
      const newHandles = await this.driver.getAllWindowHandles();
      await this.driver.switchTo().window(newHandles[newHandles.length - 1]);
    }
  }

  // ---------------- Login ----------------
  async login() {
    await this.driver.get("https://www.linkedin.com/login");
    await this.driver.sleep(3000);

    const currentUrl = await this.driver.getCurrentUrl();
    if (currentUrl.includes("feed") || currentUrl.includes("jobs")) {
      console.log("✅ Logged in automatically via Chrome profile cookies.");
      return;
    }

    console.log("⚠️ Not logged in. Please log in manually.");
    try {
      const usernameInput = await this.driver.wait(until.elementLocated(By.id("username")), this.waitTimeout);
      await usernameInput.clear();
      await usernameInput.sendKeys(this.email);

      const pwdInput = await this.driver.findElement(By.id("password"));
      await pwdInput.clear();
      await pwdInput.sendKeys(this.password + Key.RETURN);

      await this.driver.wait(async () => {
        const url = await this.driver.getCurrentUrl();
        return url.includes("feed") || url.includes("jobs");
      }, this.waitTimeout);

      console.log("✅ Logged in manually.");
    } catch (err) {
      console.log("⛔ Login failed. Please check credentials.");
    }
  }

  // ---------------- Search Jobs ----------------
  async searchJobs() {
    const enabledTitles = Object.keys(this.titlesDict).filter((k) => this.titlesDict[k]);
    if (!enabledTitles.length) {
      console.log("⛔ No job titles enabled in config.");
      await this.driver.quit();
      return [];
    }

    const searchKeywords = enabledTitles.join(" OR ");
    const params = new URLSearchParams({
      keywords: searchKeywords,
      location: this.location,
    });
    if (this.f_TPR) params.set("f_TPR", this.f_TPR);

    await this.driver.get(`https://www.linkedin.com/jobs/search/?${params.toString()}`);
    await this.driver.sleep(5000);

    console.log(`🔍 Searching jobs for '${enabledTitles.join(", ")}' in '${this.location}'`);

    const results = [];
    const processedJobs = new Set();
    let page = 1;

    while (results.length < 100 && page <= 20) {
      await this.driver.sleep(3000);
      let prevHeight = await this.driver.executeScript("return document.body.scrollHeight");

      while (true) {
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await this.driver.sleep(2000);
        const newHeight = await this.driver.executeScript("return document.body.scrollHeight");
        if (newHeight === prevHeight) break;
        prevHeight = newHeight;
      }

      let jobCards = [];
      try {
        jobCards = await this.driver.findElements(By.css("li[data-occludable-job-id]"));
      } catch {
        console.log("⚠️ No job cards found on this page.");
        break;
      }

      for (const card of jobCards) {
        if (results.length >= 100) break;

        let jobId;
        try {
          jobId = await card.getAttribute("data-occludable-job-id");
          if (processedJobs.has(jobId)) continue;
          processedJobs.add(jobId);
        } catch {
          continue;
        }

        try {
          const link = await card.findElement(By.css("a.job-card-container__link"));
          await this.driver.executeScript("arguments[0].click();", link);
          await this.driver.sleep(2000);
          await this.driver.wait(until.elementLocated(By.css(".jobs-description__container")), this.waitTimeout);
        } catch {
          continue;
        }

        // ---------------- Extract Job Data ----------------
        const getText = async (selector) => {
          try {
            const el = await this.driver.findElement(By.css(selector));
            return (await el.getText()).trim();
          } catch {
            return "N/A";
          }
        };

        const title = await getText(".job-details-jobs-unified-top-card__job-title h1");
        const company = await getText(".job-details-jobs-unified-top-card__company-name");
        const locRaw = await getText(".job-details-jobs-unified-top-card__primary-description-container");
        const loc = locRaw.split("·")[0].trim();

        const footerElems = await card.findElements(By.css(".job-card-list__footer-wrapper li"));
        let footer = "N/A";
        if (footerElems.length) {
          const texts = await Promise.all(footerElems.map((e) => e.getText()));
          footer = texts.filter(Boolean).join(" | ");
        }

        let easyApply = "No";
        try {
          const easyBtn = await this.driver.findElements(By.css(".jobs-apply-button--top-card button"));
          if (easyBtn.length > 0) {
            const text = await easyBtn[0].getText();
            if (text.includes("Easy Apply")) easyApply = "Yes";
          }
        } catch {}

        let applyLink = "N/A";
        if (easyApply === "No") {
          try {
            const externalBtn = await this.driver.findElement(By.css("a[data-control-name='jobdetails_topcard_inapply']"));
            applyLink = (await externalBtn.getAttribute("href")) || "N/A";
          } catch {}
        }

        const jobTypeButtons = await this.driver.findElements(By.css(".job-details-fit-level-preferences button"));
        const jobType = jobTypeButtons.length > 1 ? await jobTypeButtons[1].getText() : "N/A";

        const description = await getText(".jobs-description__container");

        let experience = "N/A";
        const expMatch = description.match(/(\d+)\+?\s*(?:year|yr)[s]?/i);
        if (expMatch) experience = `${expMatch[1]} years`;

        let salary = "N/A";
        try {
          const salaryElem = await this.driver.findElement(By.css(".jobs-unified-top-card__salary-info, .salary-compensation__text"));
          salary = (await salaryElem.getText()).trim();
        } catch {
          const salMatch = description.match(/(\₹?\$?\d[\d,\.]+\s*(?:per\s*(month|year)|\/year|\/month)?)/i);
          if (salMatch) salary = salMatch[1];
        }

        const scrapFrom = "LINKEDIN";
        console.log(`${title} | ${company} | ${loc} | ${footer} | Easy Apply: ${easyApply} | Job Type: ${jobType} | Exp: ${experience} | Salary: ${salary} | Apply Link: ${applyLink}`);

        results.push([title, company, loc, footer, easyApply, jobType, description, experience, salary, applyLink, scrapFrom]);
      }

      // ---------------- Next Page ----------------
      if (results.length < 100 && page < 2) {
        try {
          const nextBtn = await this.driver.wait(until.elementLocated(By.css(`button[aria-label='Page ${page + 1}']`)), 5000);
          await this.driver.executeScript("arguments[0].click();", nextBtn);
          page += 1;
          console.log(`➡️ Moving to page ${page}...`);
          await this.driver.sleep(5000);
        } catch {
          console.log("⚠️ No more pages available.");
          break;
        }
      } else {
        break;
      }
    }

    return results;
  }

  // ---------------- Save Results ----------------
  async saveResults(results) {
    this.resultManager.saveToCSV(results);
    this.config.titles = this.titlesDict;
    this.configManager.saveConfig();
  }

  // ---------------- Run ----------------
  async run() {
    await this.selectProfile();
    await this.setupDriver();
    await this.ensureLinkedInTab();
    await this.login();
    const results = await this.searchJobs();
    if (results.length) await this.saveResults(results);
  }
}

module.exports = LinkedInScraper;
