const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

class InputField {
  constructor(driver, element) {
    this.driver = driver;
    this.element = element;
  }

  async setValue(value) {
    await this.driver.wait(until.elementIsVisible(this.element), 10000);
    await this.element.clear();
    await this.element.sendKeys(value);
  }

  async clear() {
    await this.element.clear();
  }
}

describe('Test projects tab', function () {
  let driver;

  before(async function () {
    this.timeout(10000); // set timeout to 10 seconds
    driver = await new Builder().forBrowser('chrome').build();

    // log in
    await driver.get('http://127.0.0.1:3000/login');

    const emailInput = new InputField(driver, await driver.findElement(By.id('email')));
    const passwordInput = new InputField(driver, await driver.findElement(By.id('password')));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.setValue('asd@asd.com');
    await passwordInput.setValue('asd');
    await loginButton.click();
  });

  after(async function () {
    await driver.quit();
  });

  it('should navigate to the poject page and assert details of any project', async function () {
    // Find the Projects link and click it
    const projectLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/project')]"));
    await projectLink.click();


    // Wait for the URL to change and assert that it's the expected URL
    await driver.wait(until.urlContains("/project"));
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, "http://127.0.0.1:3000/project");

    // Click on a project from the Projects list
    const project = await driver.findElement(By.xpath('//div[@class="list-group project-list"]//a[1]'));
    await project.click();

    // Assert that there is any text displayed in the Details section
    const details = await driver.findElement(By.xpath('//div[@class="project-detail-table"]'));
    const text = await details.getText();
    assert(text.length > 0, 'Details section does not have any text');
  });
});
