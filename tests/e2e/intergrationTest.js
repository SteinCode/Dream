const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const {Select} = require('selenium-webdriver/lib/select');

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

async function selectProject(driver, projectName) {
    const projectList = await driver.findElement(By.className('project-list'));
    const projectLinks = await projectList.findElements(By.xpath('//a'));
    for (let link of projectLinks) {
      const text = await link.getText();
      if (text === projectName) {
        await link.click();
        break;
      }
    }
}

describe('Integration', function () {
  let driver;

  beforeEach(async () => {
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

    // Find the Projects link and click it
    const projectLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/project')]"));
    await projectLink.click();

    // Wait for the URL to change and assert that it's the expected URL
    await driver.wait(until.urlContains("/project"));
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, "http://127.0.0.1:3000/project");
  });

  afterEach(async () => {
    await driver.quit();
  });

  it('should create project and then find it in the list', async () => {
    // Click the create button
    await driver.findElement(By.className("create-new-project-btn")).click();
  
    // Set form field values
    const projectNameInput = await driver.wait(until.elementLocated(By.id("project-name")));
    await projectNameInput.sendKeys("testName");

    const projectDescriptionInput = await driver.wait(until.elementLocated(By.id("project-description")));
    await projectDescriptionInput.sendKeys("testDesc");

    const taskDeadlineInput = await driver.wait(until.elementLocated(By.id("project-deadline")));
    await taskDeadlineInput.sendKeys("05/05/2023");

    const addUserSelect = await driver.wait(until.elementLocated(By.id("add-user-select")));
    const addUserSelectDropdown = await driver.wait(until.elementIsVisible(addUserSelect));
    const addUserSelectOption = await addUserSelectDropdown.findElement(By.css("option:nth-child(2)"));
    await addUserSelectOption.click();
  
    // Submit the form
    await driver.findElement(By.id("create-button")).click();
  
    // Wait for the alert to be displayed
    await driver.wait(until.alertIsPresent());
  
    // close alert
    const alert = await driver.switchTo().alert();
    alert.accept();

    // Close the form
    await driver.findElement(By.xpath('//button[@class="close-modal"]/img')).click();

    await selectProject(driver, 'testName');
    const selectedProject = await driver.findElement(By.css('.project-list .active')).getText();
    assert.equal(selectedProject, 'testName', 'Project with name "testName" should be selected');
  });
});
