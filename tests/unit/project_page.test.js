import { selectProject } from "../../frontend/static/js/project.js";

describe("selectProject", () => {
  let target, selectedProjectName, projectItems;

  beforeEach(() => {
    // Create a mock target element
    target = document.createElement("a");
    target.classList.add("list-group-item");
    target.textContent = "Project 1";

    // Create mock selectedProjectName element
    selectedProjectName = document.createElement("div");

    // Create mock project items
    projectItems = [      document.createElement("a"),      document.createElement("a"),      document.createElement("a"),    ];
    projectItems.forEach((item) => item.classList.add("list-group-item"));

    // Add the mock elements to the document body
    document.body.appendChild(target);
    document.body.appendChild(selectedProjectName);
    projectItems.forEach((item) => document.body.appendChild(item));
  });

  afterEach(() => {
    // Remove the mock elements from the document body
    document.body.removeChild(target);
    document.body.removeChild(selectedProjectName);
    projectItems.forEach((item) => document.body.removeChild(item));
  });

  test("ignores non-list-group-item target", () => {
    // Add a non-list-group-item class to the target
    target.classList.remove("list-group-item");
    target.classList.add("other-class");

    // Call the selectProject function with the mock event
    selectProject({ target });

    // Check that the selected project name is not set
    expect(selectedProjectName.textContent).toBe("");

    // Check that no project items have the 'active' class removed or added
    projectItems.forEach((item) => expect(item.classList).not.toContain("active"));
    expect(target.classList).not.toContain("active");
  });
});
