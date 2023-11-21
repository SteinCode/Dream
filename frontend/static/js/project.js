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
  showModal(attendantsModal);
}

const closeAttendantsModal = document.querySelector(".close-attendants-modal");
closeAttendantsModal.addEventListener("click", hideAttendantsModal);

function hideAttendantsModal(event) {
  event.stopPropagation();
  hideModal(attendantsModal);
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the container elements for the user lists
  const usersList = document.getElementById("users-list");
  const addedUsersList = document.getElementById("added-users-list");

  function createUserListItem(userElement) {
    const clonedUserElement = userElement.cloneNode(true);

    clonedUserElement.addEventListener("click", function () {
      if (this.parentNode.id === "users-list") {
        addedUsersList.appendChild(this);
      } else {
        usersList.appendChild(this);
      }
    });

    return clonedUserElement;
  }

  // Get all existing user list items from the template
  const users = document.querySelectorAll(".attendant-list-group-item");

  // Iterate over each user element and append a clone to the usersList
  users.forEach((userElement) => {
    // Append the cloned and event-bound user list item to usersList
    usersList.appendChild(createUserListItem(userElement));
    // Remove the original to avoid duplicates
    userElement.remove();
  });

  function addAttendant(projectId, attendantId) {
    return fetch(`/add-attendant/${projectId}/${attendantId}`, {
      method: "POST",
      // Add any necessary headers, body, etc.
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // or .text(), etc. depending on your response
    });
  }

  // Function to handle the DELETE request to remove an attendant
  function deleteAttendant(projectId, attendantId) {
    return fetch(`/delete-attendant/${projectId}/${attendantId}`, {
      method: "DELETE",
      // Add any necessary headers, body, etc.
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // or .text(), etc. depending on your response
    });
  }
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
