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
const projectNameInput = document.getElementById("createProjectName");
const projectDescriptionInput = document.getElementById(
  "createProjectDescription"
);
const projectDeadlineInput = document.getElementById("createProjectDeadline");
const submitButton = document.getElementById("submit-project");

document.getElementById("createProjectDeadline").min = utils.getCurrentDate();

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
});

//Disable create button if fileds is not filled
function checkFields() {
  const projectNameFilled = projectNameInput.value.trim() !== "";
  const projectDescriptionFilled = projectDescriptionInput.value.trim() !== "";
  const projectDeadlineFilled = projectDeadlineInput.value.trim() !== "";

  submitButton.disabled = !(
    projectNameFilled &&
    projectDescriptionFilled &&
    projectDeadlineFilled
  );
}

projectNameInput.addEventListener("input", checkFields);
projectDescriptionInput.addEventListener("input", checkFields);
projectDeadlineInput.addEventListener("input", checkFields);

checkFields();

export { showModal, hideModal, selectProject };
