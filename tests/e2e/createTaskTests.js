const { Builder, By, until, Select } = require("selenium-webdriver");
const assert = require("assert");

describe("Task creation tests", function () {
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

  it("Should open tasks page with task page link", async function () {
    await driver.get("http://localhost:3000/tasks");
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should open task creation modal window", async function () {
    const openTaskBtn = await driver.findElement(
      By.className("project-task-btn__add")
    );
    await openTaskBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let create the task without any input", async function () {
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let create the task only with task name", async function () {
    const taskName = await driver.findElement(By.id("taskName"));
    await taskName.sendKeys("test task name");
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let create the task only with task name and description", async function () {
    const taskDescription = await driver.findElement(By.id("taskDescription"));
    await taskDescription.sendKeys("test task description");
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let create the task only with task name and description and deadline", async function () {
    const taskDeadline = await driver.findElement(By.id("taskDeadline"));
    await taskDeadline.sendKeys("2023-06-01");
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("Should not let create task with past date", async function () {
    const assignedUserSelect = await driver.findElement(
      By.id("assignedUserId")
    );
    const assignedUserOptionValue = "19"; // Replace with the value of the option you want to select
    const assignedUserSelectElement = new Select(assignedUserSelect);
    await assignedUserSelectElement.selectByValue(assignedUserOptionValue);
    const taskDeadline = await driver.findElement(By.id("taskDeadline"));
    await taskDeadline.sendKeys("2023-03-01");
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("After submitting the new task creation, the new task should be visible in the to-do column", async function () {
    const taskName = "test task name";
    const taskDeadline = await driver.findElement(By.id("taskDeadline"));
    await taskDeadline.sendKeys("2023-06-01");
    const submitNewTask = await driver.findElement(By.id("submitNewTask"));
    await submitNewTask.click();
    let taskFound = false;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tasks = await driver.findElements(By.className("task-name"));
    for (const task of tasks) {
      const name = await task.getText();
      console.log(name);
      if (name === taskName) {
        taskFound = true;
        break;
      }
    }

    assert.ok(taskFound, `Task '${taskName}' not found in to-do column`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  after(async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.quit();
  });
});
