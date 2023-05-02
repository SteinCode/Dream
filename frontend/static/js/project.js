function showModal() {
  const modal = document.querySelector(".project-modal-window");
  modal.style.display = "flex";
}

function hideModal() {
  const modal = document.querySelector(".project-modal-window");
  modal.style.display = "none";
}

function addUser() {
  const select = document.querySelector('select[name="add-user"]');
  const { dataset, textContent } = select.options[select.selectedIndex];
  const { id: userId, role } = dataset;

  const table = document.getElementById("user-table");
  const rowHtml = `
    <tr>
      <td>${textContent}</td>
      <td>${role}</td>
      <input type="hidden" name="user-id" value="${userId}">
    </tr>
  `;
  table.insertAdjacentHTML("beforeend", rowHtml);

  // Store user data in an object and push it to the users array
  const userData = { id: userId, name: textContent, role };
  users.push(userData);
}

async function createProject() {
  const projectNameInput = document.getElementById("project-name");
  const projectName = projectNameInput.value;
  const table = document.getElementById("user-table");
  const tableRows = Array.from(table.rows);
  const users = tableRows.map((row) => {
    const [userName, role] = row.cells;
    const userId = row.querySelector('input[name="user-id"]').value;
    return { id: userId, name: userName.textContent, role: role.textContent };
  });
  try {
    const response = await fetch("/project/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName, users }),
    });
    const data = await response.json();
    console.log(data);
    window.alert('Project created successfully!');
  } catch (error) {
    console.log(error);
  }
}

function selectProject(event) {
  const target = event.target;
  console.log(target.classList);

  if (target.classList.contains("delete-project-btn")) {
    deleteProject(event);
  } else if (target.classList.contains("list-group-item")) {
    const selectedProject = target.textContent.trim();
    selectedProjectName.textContent = selectedProject;

    // Remove the 'active' class from all project items
    const projectItems = document.querySelectorAll('.list-group-item');
    projectItems.forEach(item => item.classList.remove('active'));

    // Add the 'active' class to the selected project item
    target.classList.add('active');
  }
}

const projectList = document.querySelector(".project-list");
const selectedProjectName = document.querySelector(".project-name");

projectList.addEventListener("click", selectProject);

const deleteButtons = document.querySelectorAll(".delete-project-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", deleteProject);
});

async function deleteProject(event) {
  event.stopPropagation();
  const projectId = event.currentTarget.dataset.projectId;
  const url = `/project/delete-project/${projectId}`;

  try {
    const response = await fetch(url, { method: "DELETE" });

    if (response.ok) {
      const data = await response.json();
      // Handle the success response
      console.log(data);
    } else {
      // Handle the error response
      const errorData = await response.json();
      console.log(errorData);
    }
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the button and modal elements
  const btn = document.querySelector(".create-new-project-btn");
  const closeBtn = document.querySelector(".close-modal");

  // Add a click event listener to the button
  btn.addEventListener("click", showModal);
  closeBtn.addEventListener("click", hideModal);

  const createButton = document.getElementById("create-button");
  const table = document.getElementById("user-table");
  let users = [];

  const select = document.querySelector('select[name="add-user"]');
  select.addEventListener("change", addUser);
  createButton.addEventListener("click", createProject);
});

export { showModal, hideModal, addUser, createProject, selectProject };
