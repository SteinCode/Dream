const { Builder, By, until, Select, Actions } = require("selenium-webdriver");
const assert = require("assert");
let generatedCode;
describe("Code generation and registration with that code integration tests", function () {
  this.timeout(20000); // Increase timeout to 20 seconds

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("firefox").build();
    await driver.get("http://localhost:3000/login");

    // Enter email and password
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("1@1.1");
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("1");
    const loginButton = await driver.findElement(By.className("btn-primary"));
    await loginButton.click();

    // Wait for page to load and assert that we're logged in
    await driver.wait(until.urlIs("http://localhost:3000/"), 5000);
  });

  after(async function () {
    await driver.quit();
  });

  it("Should open tasks page with task page link", async function () {
    await driver.get("http://localhost:3000/");
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should open code generation modal window", async function () {
    const openModalBtn = await driver.findElement(
      By.className("code-generation-button")
    );
    await openModalBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should generate code by clicking Generate button", async function () {
    const generateButton = await driver.findElement(By.id("generate-button"));
    await generateButton.click();
    const generatedCodeInput = await driver.findElement(
      By.id("generated-code")
    );
    generatedCode = await generatedCodeInput.getAttribute("value");
    console.log(generatedCode);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should close code generation modal window", async function () {
    const closeModalBtn = await driver.findElement(By.className("close-modal"));
    await closeModalBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should logout from the system by pressing logout tab", async function () {
    const logoutTab = await driver.findElement(By.className("logout"));
    await logoutTab.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("By click register should redirect to register page", async function () {
    const registerLink = await driver.findElement(By.id("register-link"));
    await registerLink.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let register with incorrect generated code", async function () {
    const codeInput = await driver.findElement(By.id("code"));
    await codeInput.sendKeys("test");
    const nameInput = await driver.findElement(By.id("name"));
    await nameInput.sendKeys("test");
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("test@test.test");
    const surnameInput = await driver.findElement(By.id("surname"));
    await surnameInput.sendKeys("test");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const phoneInput = await driver.findElement(By.id("phoneNumber"));
    await phoneInput.sendKeys("1");
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("test");
    const confirmPasswordInput = await driver.findElement(
      By.id("passwordConfirm")
    );
    await confirmPasswordInput.sendKeys("test");
    const roleInput = await driver.findElement(By.id("role"));
    const roleValue = "Developer"; // Replace with the value of the option you want to select
    const roleInputElement = new Select(roleInput);
    await roleInputElement.selectByValue(roleValue);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const submitButton = await driver.findElement(By.id("submit-register"));
    await submitButton.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await driver.wait(until.elementLocated(By.className("error-alert")), 5000);
  });

  it("Should register user with correct generated code", async function () {
    const codeInput = await driver.findElement(By.id("code"));
    await codeInput.sendKeys(generatedCode);
    const nameInput = await driver.findElement(By.id("name"));
    await nameInput.sendKeys("test");
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("test@test.test");
    const surnameInput = await driver.findElement(By.id("surname"));
    await surnameInput.sendKeys("test");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const phoneInput = await driver.findElement(By.id("phoneNumber"));
    await phoneInput.sendKeys("1");
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("test");
    const confirmPasswordInput = await driver.findElement(
      By.id("passwordConfirm")
    );
    await confirmPasswordInput.sendKeys("test");
    const roleInput = await driver.findElement(By.id("role"));
    const roleValue = "Developer"; // Replace with the value of the option you want to select
    const roleInputElement = new Select(roleInput);
    await roleInputElement.selectByValue(roleValue);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const submitButton = await driver.findElement(By.id("submit-register"));
    await submitButton.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await driver.wait(
      until.elementLocated(By.className("success-alert")),
      5000
    );
  });

  it("Should login with newly created credentials", async function () {
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("test@test.test");
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("test");
    const loginButton = await driver.findElement(By.className("btn-primary"));
    await loginButton.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
});
