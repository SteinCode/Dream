import utils from "./utils.js";

//---------- PROJECT PAGE VIEW
const projectList = document.querySelector(".project-list");
const selectedProjectName = document.querySelector(".project-name");
const deleteButtons = document.querySelectorAll(".delete-project-btn");

function selectProject(event) {
  const target = event.target;
  console.log(target.classList);

  if (target.classList.contains("delete-project-btn")) {
    deleteProject(event);
  } else if (target.classList.contains(".btn btn-primary")) {
    console.log("asdsadsadsad");
    editProject(event);
  } else if (target.classList.contains("list-group-item")) {
    const selectedProject = target.textContent.trim();
    selectedProjectName.textContent = selectedProject;

    // Remove the 'active' class from all project items
    const projectItems = document.querySelectorAll(".list-group-item");
    projectItems.forEach((item) => item.classList.remove("active"));

    // Add the 'active' class to the selected project item
    target.classList.add("active");
    projectModal.style.display = "block";
  }
}

projectList.addEventListener("click", selectProject);

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

// ---------- CREATE PROJECT VIEW

var projectModal = document.querySelector("#project-modal-window");
projectModal.style.display = "none";

document.getElementById("create-project-deadline").min = utils.getCurrentDate();

function showModal(modal) {
  modal.style.display = "flex";
}

function hideModal(modal) {
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const createProjectBtn = document.querySelector(".create-new-project-btn");
  const closeProjectBtn = document.querySelector(".close-modal");

  const projectModal = document.querySelector("#project-modal-window");

  createProjectBtn.addEventListener("click", function () {
    showModal(projectModal);
  });

  closeProjectBtn.addEventListener("click", function () {
    hideModal(projectModal);
  });

  const submitProject = document.getElementById("submit-project");

  submitProject.addEventListener("click", createProject);
});

async function createProject() {
  const projectNameInput = document.getElementById("project-name");
  const projectName = projectNameInput.value;
  try {
    const response = await fetch("/project/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName, users }),
    });
    const data = await response.json();
    console.log(data);
    window.alert("Project created successfully!");
  } catch (error) {
    console.log(error);
  }
}

export { showModal, hideModal, createProject, selectProject };
