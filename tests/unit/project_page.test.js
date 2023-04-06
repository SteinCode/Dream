import { selectProject, createProject } from "../../frontend/static/js/project.js";

describe("selectProject function", () => {
  const selectedProjectName = document.getElementById("selected-project-name");

  test("clicking list item should update selectedProjectName", () => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.textContent = "Test Project";
    document.getElementById("project-list").appendChild(listItem);

    listItem.click();

    expect(selectedProjectName.textContent).toBe("Test Project");
  });
});

describe("createProject function", () => {
  const table = document.getElementById("user-table");

  test("clicking createButton should call fetch with correct data", async () => {
    const projectNameInput = document.getElementById("project-name");
    const projectName = projectNameInput.value;
    const tableRows = Array.from(table.rows);
    const users = tableRows.map((row) => {
      const [userName, role] = row.cells;
      const userId = row.querySelector('input[name="user-id"]').value;
      const userRole = role.querySelector('select[name="user-role"]').value;
      return { id: userId, role: userRole };
    });

    global.fetch = jest.fn(() => Promise.resolve());

    const createButton = document.getElementById("create-project");
    createButton.click();

    expect(fetch).toHaveBeenCalledWith("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName, users }),
    });
  });
});
