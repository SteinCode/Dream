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

const projectContainer = document.querySelector(".project-container");
const activeProjectId = projectContainer.getAttribute("active-project-id");

// Function to move a user list item from its current list to a target list
function moveUserItem(listItem, targetListId) {
  const userId = listItem.getAttribute("data-user-id"); // Extract user ID
  const targetList = document.getElementById(targetListId);

  // Remove the item from its current parent list
  listItem.parentNode.removeChild(listItem);

  // Append the item to the target list
  targetList.appendChild(listItem);

  // Depending on the target list, call the appropriate function
  if (targetListId === "added-users-list") {
    addAttendant(activeProjectId, userId)
      .then((response) => {
        console.log("Attendant added:", response);
      })
      .catch((error) => {
        console.error("Error adding attendant:", error);
      });
  } else {
    deleteAttendant(activeProjectId, userId)
      .then((response) => {
        console.log("Attendant removed:", response);
      })
      .catch((error) => {
        console.error("Error removing attendant:", error);
      });
  }

  // Reattach the event handler for the new position of the list item
  listItem.addEventListener("click", function (event) {
    if (
      event.target.tagName === "LI" &&
      !event.target.classList.contains("attendant-list-item-delete")
    ) {
      // Determine the new target list based on the current list of the item
      const newTargetListId =
        targetListId === "available-users-list"
          ? "added-users-list"
          : "available-users-list";
      moveUserItem(listItem, newTargetListId);
    }
  });
}

// Now update the event listeners to handle the click event correctly
function initializeListHandlers() {
  document
    .getElementById("available-users-list")
    .addEventListener("click", function (event) {
      let target = event.target;
      // Ensure the click is not on the delete button
      if (target.classList.contains("attendant-list-item-delete")) {
        return;
      }
      // If the target is not the LI itself, find the LI ancestor
      if (target.tagName !== "LI") {
        target = target.closest("li");
      }
      moveUserItem(target, "added-users-list");
    });

  document
    .getElementById("added-users-list")
    .addEventListener("click", function (event) {
      let target = event.target;
      // Ensure the click is not on the delete button
      if (target.classList.contains("attendant-list-item-delete")) {
        return;
      }
      // If the target is not the LI itself, find the LI ancestor
      if (target.tagName !== "LI") {
        target = target.closest("li");
      }
      moveUserItem(target, "available-users-list");
    });
}

// Call the function to initialize event handlers
initializeListHandlers();

const deleteAttendantButtons = document.querySelectorAll(
  ".attendant-list-item-delete"
);

deleteAttendantButtons.forEach((button) => {
  const userId = button.getAttribute("data-user-id");
  button.addEventListener("click", () => {
    deleteAttendant(activeProjectId, userId);
  });
});

function addAttendant(projectId, attendantId) {
  console.log(projectId);
  console.log(attendantId);
  return fetch(`project/add-attendant/${projectId}/${attendantId}`, {
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
  return fetch(`project/delete-attendant/${projectId}/${attendantId}`, {
    method: "DELETE",
    // Add any necessary headers, body, etc.
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // or .text(), etc. depending on your response
  });
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
