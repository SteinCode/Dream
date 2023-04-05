/* Task page js*/

// Create task window
const createTaskBtn = document.querySelector(".project-participants__add");
const modal = document.querySelector(".create-task-modal-window");
const closeBtn = document.querySelector(".close-modal");

//Toggle visibility of modal window
createTaskBtn.addEventListener("click", async () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

const workerRows = document.querySelectorAll(".worker-table .worker-row");

const assignedUserIdInput = document.querySelector("#assignedUserIdInput");
workerRows.forEach((row) => {
  row.addEventListener("click", () => {
    // Remove the selected class from all rows
    workerRows.forEach((row) => {
      row.classList.remove("selected");
    });

    // Add the selected class to the clicked row
    row.classList.add("selected");

    // Set the value of the hidden input field to the ID of the selected row
    const userId = row.getAttribute("data-user-id");
    assignedUserIdInput.value = userId;
  });
});

// Task form validation

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  // Add leading zero to single digit month and day values
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}
document.getElementById("taskDeadline").min = getCurrentDate();

// Updating form page
const form = document.querySelector("form"); // select the form element

// form.addEventListener("submit", (event) => {
//   event.preventDefault(); // prevent default form submission

//   const formData = new FormData(form); // create a FormData object from the form data

//   fetch("/tasks/create-task", {
//     // send the POST request to the server
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json()) // parse the response as JSON
//     .then((data) => {
//       console.log(data.newTask); // log the new task information to the console
//       // do something with the new task information, such as updating the UI
//     })
//     .catch((error) => {
//       console.error("Error creating task:", error); // log any errors to the console
//     });
// });

// Task dragging logic
document.addEventListener("DOMContentLoaded", (event) => {
  var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.outline = "3px dashed #c4cad3";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add("task-hover");
  }

  function handleDragLeave(e) {
    this.classList.remove("task-hover");
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData("text/html");
    }

    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = "1";
    this.style.border = 0;

    items.forEach(function (item) {
      item.classList.remove("task-hover");
    });
  }

  let items = document.querySelectorAll(".task");
  items.forEach(function (item) {
    item.addEventListener("dragstart", handleDragStart, false);
    item.addEventListener("dragenter", handleDragEnter, false);
    item.addEventListener("dragover", handleDragOver, false);
    item.addEventListener("dragleave", handleDragLeave, false);
    item.addEventListener("drop", handleDrop, false);
    item.addEventListener("dragend", handleDragEnd, false);
  });
});
