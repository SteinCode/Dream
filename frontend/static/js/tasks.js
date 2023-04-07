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

// Task dragging logic
function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl && dragSrcEl.parentElement && dragSrcEl != this) {
    let newTaskEl = document.createElement("div");
    newTaskEl.classList.add("task");
    newTaskEl.setAttribute("draggable", "true");
    newTaskEl.innerHTML = e.dataTransfer.getData("text/html");
    if (this.classList.contains("project-column")) {
      this.insertBefore(newTaskEl, this.firstChild);
    } else {
      this.parentElement.insertBefore(newTaskEl, this.nextSibling);
    }
    dragSrcEl.parentElement.removeChild(dragSrcEl);
  }
  return false;
}

document.addEventListener("DOMContentLoaded", (event) => {
  var dragSrcEl = null;
  var currentHoveredEl = null;

  function handleDragStart(e) {
    this.style.outline = "3px dashed #c4cad3";
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.outerHTML);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (this.classList.contains("project-column")) {
      this.classList.add("project-column-hover");
    }
  }

  function handleDragEnter(e) {
    if (this.classList.contains("project-column")) {
      currentHoveredEl = this;
      currentHoveredEl.classList.add("project-column-hover");
    }
  }

  function handleDragLeave(e) {
    if (currentHoveredEl && !currentHoveredEl.contains(e.target)) {
      currentHoveredEl.classList.remove("project-column-hover");
      currentHoveredEl = null;
    }
  }

  function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl != this) {
      let newTaskEl = document.createElement("div");
      newTaskEl.classList.add("task");
      newTaskEl.setAttribute("draggable", "true");
      newTaskEl.innerHTML = e.dataTransfer.getData("text/html");
      if (this.classList.contains("project-column")) {
        this.insertBefore(newTaskEl, this.firstChild);
      } else {
        this.parentElement.insertBefore(newTaskEl, this.nextSibling);
      }
      dragSrcEl.parentElement.removeChild(dragSrcEl);
    }
    return false;
  }

  function handleDragEnd(e) {
    this.style.outline = "none";
    this.style.opacity = "1";
    this.classList.remove("project-column-hover");
    currentHoveredEl = null;
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

  let columns = document.querySelectorAll(".project-column");
  columns.forEach(function (column) {
    column.addEventListener("dragover", handleDragOver, false);
    column.addEventListener("dragenter", handleDragEnter, false);
    column.addEventListener("dragleave", handleDragLeave, false);
    column.addEventListener("drop", handleDrop, false);
  });
});
