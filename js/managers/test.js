const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testDriver() {
  let options = new chrome.Options();
  options.setChromeBinaryPath('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  options.addArguments('--start-maximized');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromedriver.path))
    .build();

  try {
    await driver.get('https://www.google.com');
    console.log('Successfully opened Google.');
  } finally {
    await driver.quit();
  }
}

testDriver().catch(console.error);