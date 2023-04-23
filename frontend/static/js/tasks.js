// Create task window
const createTaskBtn = document.querySelector(".project-task-btn__add");
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
let cards = document.querySelectorAll(".task-card");
let lists = document.querySelectorAll(".task-list");

cards.forEach((card) => {
  registerEventsOnCard(card);
});

lists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    let draggingCard = document.querySelector(".dragging");
    let cardAfterDraggingCard = getCardAfterDraggingCard(list, e.clientY);
    if (cardAfterDraggingCard) {
      cardAfterDraggingCard.parentNode.insertBefore(
        draggingCard,
        cardAfterDraggingCard
      );
      draggingCard.dataset.status = cardAfterDraggingCard.dataset.status;
    } else {
      list.appendChild(draggingCard);
      draggingCard.dataset.status = list.dataset.status;
    }
  });
});

function getCardAfterDraggingCard(list, yDraggingCard) {
  let listCards = [...list.querySelectorAll(".task-card:not(.dragging)")];

  return listCards.reduce(
    (closestCard, nextCard) => {
      let nextCardRect = nextCard.getBoundingClientRect();
      let offset = yDraggingCard - nextCardRect.top - nextCardRect.height / 2;

      if (offset < 0 && offset > closestCard.offset) {
        return { offset, element: nextCard };
      } else {
        return closestCard;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function registerEventsOnCard(card) {
  card.addEventListener("dragstart", (e) => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    card.classList.remove("dragging");
    let newParent = card.closest(".task-list");
    let newStatus = "";
    if (newParent.classList.contains("tasklist-to-do")) {
      newStatus = "to do";
    } else if (newParent.classList.contains("tasklist-in-progress")) {
      newStatus = "in progress";
    } else if (newParent.classList.contains("tasklist-needs-review")) {
      newStatus = "needs review";
    } else if (newParent.classList.contains("tasklist-done")) {
      newStatus = "done";
    }
    card.dataset.status = newStatus;
    card.setAttribute("status", newStatus);
    card.setAttribute("is-changed", true);
  });
}

const taskCards = document.querySelectorAll(".task-card");

taskCards.forEach((taskCard) => {
  taskCard.addEventListener("dragend", async (event) => {
    const taskId = event.target.getAttribute("task-id");
    const taskStatus = event.target.getAttribute("status");
    const response = await fetch(`/tasks/update-task-status/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: taskStatus }),
    });
  });
});
//Get current date for task deadline
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
