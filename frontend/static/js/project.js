import utils from "./utils.js";

//---------- PROJECT PAGE VIEW

const projectList = document.querySelector(".project-list");

projectList.addEventListener("click", selectProject);

function selectProject(event) {
  var clickedElement = event.target;
  if (
    clickedElement.classList.contains("list-group-items") &&
    clickedElement.classList.contains("list-group-item-action")
  ) {
    var projectId = clickedElement.getAttribute("data-project-id");
    var url = `/project/set-active-project/${projectId}`;
    fetch(url, { method: "PUT" })
      .then((response) => {
        if (response.ok) {
          reloadPage();
          return response.json();
        } else {
          reloadPage();
          throw new Error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function reloadPage() {
  location.reload();
}

const deleteButtons = document.querySelectorAll(".project-list-item-delete");

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
      reloadPage();
    } else {
      const errorData = await response.json();
      console.log(errorData);
    }
  } catch (err) {
    console.log(err);
  }
}

// ------------ ATENDANTS ----------

const addAttendantsButton = document.querySelector(".add-new-attendants-btn");
const attendantsModal = document.querySelector("#attendants-modal-window");
attendantsModal.style.display = "none";
addAttendantsButton.addEventListener("click", showAttendantsModal);

function showAttendantsModal(event) {
  event.stopPropagation();
  console.log("showing attendants modal");
  showModal(attendantsModal);
}

const closeAttendantsModal = document.querySelector(".close-attendants-modal");
closeAttendantsModal.addEventListener("click", hideAttendantsModal);

function hideAttendantsModal(event) {
  event.stopPropagation();
  hideModal(attendantsModal);
}

document.addEventListener("DOMContentLoaded", () => {
  const users = ["Alice", "Bob", "Charlie", "Dana", "Eve"]; // Example user list
  const usersList = document.getElementById("users-list");
  const addedUsersList = document.getElementById("added-users-list");

  function createUserListItem(userName) {
    const li = document.createElement("li");
    li.textContent = userName;
    li.onclick = function () {
      if (this.parentNode.id === "users-list") {
        addedUsersList.appendChild(this);
      } else {
        usersList.appendChild(this);
      }
    };
    return li;
  }

  // Populate the initial list
  users.forEach((user) => {
    usersList.appendChild(createUserListItem(user));
  });
});

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
