const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { db, getUser } = require("../../database");

describe("user input fields", () => {
  let user;

  beforeAll(async () => {
    // Retrieve the user data from the database before running the tests
    user = await getUser();
  });

  beforeAll(() => {
    const { document } = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = document;
  });

  test("name field has correct attributes", () => {
    const dom = new JSDOM(`
      <html>
        <body>
          <div class="col-md-6">
            <label for="name" class="labels">Name</label>
            <input type="text" id="name" name="name" class="form-control" placeholder="first name" value="${user.name}">
          </div>
        </body>
      </html>
    `);
    const nameInput = dom.window.document.getElementById("name").value;
    expect(nameInput).toBe(user.name);
  });

  test("surname field has correct attributes", () => {
    const dom = new JSDOM(`
      <html>
        <body>
          <div class="col-md-6">
            <label for="surname" class="labels">Surname</label>
            <input type="text" id="surname" name="surname" class="form-control" placeholder="surname" value="${user.surname}">
          </div>
        </body>
      </html>
    `);
    const surnameInput = dom.window.document.getElementById("surname").value;
    expect(surnameInput).toBe(user.surname);
  });

  test("phone number field has correct attributes", () => {
    const dom = new JSDOM(`
      <html>
        <body>
          <div class="col-md-12">
            <label class="labels" for="phoneNumber">Phone Number</label>
            <input type="text" id="phoneNumber" name="phoneNumber" class="form-control" placeholder="enter phone number" value="${user.phoneNumber}">
          </div>
        </body>
      </html>
    `);
    const phoneInput = dom.window.document.getElementById("phoneNumber").value;
    expect(phoneInput).toBe(user.phoneNumber);
  });

  test("email field has correct attributes", () => {
    const dom = new JSDOM(`
      <html>
        <body>
          <div class="col-md-12">
            <label class="labels" for="email">Email</label>
            <input type="email" id="email" name="email" class="form-control" placeholder="enter email" value="${user.email}">
          </div>
        </body>
      </html>
    `);
    const emailInput = dom.window.document.getElementById("email").value;
    expect(emailInput).toBe(user.email);
  });
});