const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

class InputField {
    driver: any;
    element: any;
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

    await emailInput.setValue('ad@ad.lt');
    await passwordInput.setValue('ad');
    await loginButton.click();
  });

  after(async function () {
    await driver.quit();
  });

  it('should navigate to the profile page and assert details of user profile', async function () {
    // Find the profile link and click it
    const profileLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/profile')]"));
    await profileLink.click();


    // Wait for the URL to change and assert that it's the expected URL
    await driver.wait(until.urlContains("/profile"));
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, "http://127.0.0.1:3000/profile");


    // Assert that there is any text displayed in profile information window
    const name = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='name']"));
    const name_text = await name.getText();
    assert(name_text.length > 0, 'Name section does not have any text');

    const surname = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='surname']"));
    const surname_text = await surname.getText();
    assert(surname_text.length > 0, 'Surname section does not have any text');

    const phoneNumber = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='phoneNumber']"));
    const phoneNumber_text = await phoneNumber.getText();
    assert(phoneNumber_text.length > 0, 'PhoneNumber section does not have any text');

    const email = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='email']"));
    const email_text = await email.getText();
    assert(email_text.length > 0, 'Email section does not have any text');
  });

  it('should successfully change user password and log in with new password', async function () {
  // Navigate to the profile page
  const profileLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/profile')]"));
  await profileLink.click();

  // Find the change password form elements
  const currentPasswordInput = new InputField(driver, await driver.findElement(By.id('currentPassword')));
  const newPasswordInput = new InputField(driver, await driver.findElement(By.id('newPassword')));
  const repeatPasswordInput = new InputField(driver, await driver.findElement(By.id('repeatPassword')));
  const changePasswordButton = await driver.findElement(By.css('button[type="submit"]'));

  // Set current and new password values and submit the form
  const currentPassword = 'ad';
  const newPassword = 'newPassword';
  await currentPasswordInput.setValue(currentPassword);
  await newPasswordInput.setValue(newPassword);
  await repeatPasswordInput.setValue(newPassword);
  await changePasswordButton.click();

  // Wait for the change password success message and assert its presence
  const successMessage = await driver.wait(until.elementLocated(By.id('successMessage')), 10000);
  assert.strictEqual(await successMessage.isDisplayed(), true, 'Change password success message is not displayed');

  // Log out
  const logoutButton = await driver.findElement(By.id('logout-btn'));
  await logoutButton.click();

  // Log back in with the new password and assert successful login
  await driver.get('http://127.0.0.1:3000/login');

  const emailInput = new InputField(driver, await driver.findElement(By.id('email')));
  const passwordInput = new InputField(driver, await driver.findElement(By.id('password')));
  const loginButton = await driver.findElement(By.css('button[type="submit"]'));

  await emailInput.setValue('ad@ad.lt');
  await passwordInput.setValue(newPassword);
  await loginButton.click();

  await driver.wait(until.urlContains("/dashboard"), 10000);
  const currentUrl = await driver.getCurrentUrl();
  assert.strictEqual(currentUrl, "http://127.0.0.1:3000/dashboard", 'User login with new password failed');
});

it('should update the user name, surname, phone number, and email', async function () {
  // Navigate to the profile page
  const profileLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/profile')]"));
  await profileLink.click();

  // Find the edit profile form elements
  const nameInput = new InputField(driver, await driver.findElement(By.id('name')));
  const surnameInput = new InputField(driver, await driver.findElement(By.id('surname')));
  const phoneNumberInput = new InputField(driver, await driver.findElement(By.id('phoneNumber')));
  const emailInput = new InputField(driver, await driver.findElement(By.id('email')));
  const updateProfileButton = await driver.findElement(By.css('button[type="submit"]'));

  // Set new values for the user information
  const newName = 'Updated Name';
  const newSurname = 'Updated Surname';
  const newPhoneNumber = '123456799';
  const newEmail = 'updated@ad.com';

  await nameInput.setValue(newName);
  await surnameInput.setValue(newSurname);
  await phoneNumberInput.setValue(newPhoneNumber);
  await emailInput.setValue(newEmail);
  await updateProfileButton.click();

  // Wait for the update profile success message and assert its presence
  const successMessage = await driver.wait(until.elementLocated(By.id('successMessage')), 10000);
  assert.strictEqual(await successMessage.isDisplayed(), true, 'Update profile success message is not displayed');
});

it('should navigate to the profile page and assert details of user profile', async function () {
  // Find the profile link and click it
  const profileLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/profile')]"));
  await profileLink.click();


  // Wait for the URL to change and assert that it's the expected URL
  await driver.wait(until.urlContains("/profile"));
  const currentUrl = await driver.getCurrentUrl();
  assert.strictEqual(currentUrl, "http://127.0.0.1:3000/profile");


  // Assert that the updated values are displayed in the profile information window
  const name = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='name']"));
  const name_text = await name.getText();
  assert.strictEqual(name_text, 'Updated Name', 'Name section does not display the updated value');

  const surname = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='surname']"));
  const surname_text = await surname.getText();
  assert.strictEqual(surname_text, 'Updated Surname', 'Surname section does not display the updated value');

  const phoneNumber = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='phoneNumber']"));
  const phoneNumber_text = await phoneNumber.getText();
  assert.strictEqual(phoneNumber_text, '123456799', 'PhoneNumber section does not display the updated value');

  const email = await driver.findElement(By.xpath("//div[contains(@class, 'profile_info') and @name='email']"));
  const email_text = await email.getText();
  assert.strictEqual(email_text, 'updated@ad.com', 'Email section does not display the updated value');
});

it('should not allow name, surname, phone number, and email to exceed 50 characters', async function () {
  // Navigate to the profile page
  const profileLink = await driver.findElement(By.xpath("//a[contains(@class,'nav-item') and contains(@href,'/profile')]"));
  await profileLink.click();

  // Find the edit profile form elements
  const nameInput = new InputField(driver, await driver.findElement(By.id('name')));
  const surnameInput = new InputField(driver, await driver.findElement(By.id('surname')));
  const phoneNumberInput = new InputField(driver, await driver.findElement(By.id('phoneNumber')));
  const emailInput = new InputField(driver, await driver.findElement(By.id('email')));

  // Set values for the user information with more than 50 characters
  const longValue = 'a'.repeat(51);

  await nameInput.setValue(longValue);
  await surnameInput.setValue(longValue);
  await phoneNumberInput.setValue(longValue);
  await emailInput.setValue(longValue);

  // Assert that the input values do not exceed 50 characters
  const nameValue = await nameInput.element.getAttribute('value');
  const surnameValue = await surnameInput.element.getAttribute('value');
  const phoneNumberValue = await phoneNumberInput.element.getAttribute('value');
  const emailValue = await emailInput.element.getAttribute('value');

  assert.strictEqual(nameValue.length, 50, 'Name input allows more than 50 characters');
  assert.strictEqual(surnameValue.length, 50, 'Surname input allows more than 50 characters');
  assert.strictEqual(phoneNumberValue.length, 50, 'Phone number input allows more than 50 characters');
  assert.strictEqual(emailValue.length, 50, 'Email input allows more than 50 characters');
});


});
