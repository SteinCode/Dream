const { JSDOM } = require("jsdom");

describe("taskName input", () => {
  let dom;
  let input;

  beforeEach(() => {
    dom = new JSDOM(`
      <html>
        <body>
        <form id="create-task-form" action="/tasks/create-task" method="POST">
        <h1>Create a task</h1>
        <div class="flex-container">
          <div class="flex-col-left">
            <div class="form-group">
              <label for="taskName">Task Name</label>
              <input
                type="text"
                class="form-control"
                id="taskName"
                placeholder="Enter task name"
                name="taskName"
                oninvalid="this.setCustomValidity('Please enter a task name')"
              />
            </div>
            <div class="form-group">
              <label for="taskDescription">Task Description</label>
              <textarea
                class="form-control"
                id="taskDescription"
                rows="3"
                placeholder="Enter task description"
                name="taskDescription"
                oninvalid="this.setCustomValidity('Please input a task description')"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="taskDifficulty">Task Difficulty</label>
              <select
                class="form-control"
                id="taskDifficulty"
                name="taskDifficulty"
                oninvalid="this.setCustomValidity('Please select task difficulty')"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div class="form-group">
              <label for="taskDeadline">Task Deadline</label>
              <input
                name="taskDeadline"
                type="date"
                class="form-control"
                id="taskDeadline"
                oninvalid="this.setCustomValidity('Please select a valid date')"
                min=""
              />
            </div>
          </div>
          <div class="flex-col-right">
            <div class="form-group">
              <label id="developer-list" for="developer-list">Select an
                asignee:
              </label>
              <select
                name="assignedUserId"
                id="assignedUserId"
                class="selectpicker"
                oninvalid="this.setCustomValidity('Please select an assignee')"
              >
                <option value="">Select one</option>
                <optgroup label="Developers">

                  {{#each developers}}
                    <option value={{this.id}}>{{this.name}}
                      {{this.surname}}</option>
                  {{/each}}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">Create Task</button>
      </form>
        </body>
      </html>
    `);
    taskNameInput = dom.window.document.getElementById("taskName");
    taskDescriptionInput =
      dom.window.document.getElementById("taskDescription");
  });

  test("task name input field is required", () => {
    taskNameInput.value = "";
    expect(taskNameInput.checkValidity()).toBe(false);
  });
  test("task description input field is required", () => {
    taskNameInput.value = "";
    expect(taskNameInput.checkValidity()).toBe(false);
  });
  test("task deadline input field is required", () => {
    taskNameInput.value = "";
    expect(taskNameInput.checkValidity()).toBe(false);
  });
  test("user select input field is required", () => {
    taskNameInput.value = "";
    expect(taskNameInput.checkValidity()).toBe(false);
  });

  test("Task name input field should have 60 max characters attribute.", () => {
    expect(taskNameInput.getAttribute("maxlength")).toBe("60");
  });
  test("Task description input field should have 2000 max characters attribute.", () => {
    expect(taskDescriptionInput.getAttribute("maxlength")).toBe("2000");
  });
});
