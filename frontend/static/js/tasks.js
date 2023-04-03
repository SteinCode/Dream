/* Task page js*/

// Create task window
const createTaskBtn = document.querySelector(".project-participants__add");
const modal = document.querySelector(".create-task-modal-window");
const closeBtn = document.querySelector(".close-modal");

createTaskBtn.addEventListener("click", async () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

const workerRows = document.querySelectorAll(".worker-table .worker-row");

workerRows.forEach((row) => {
  row.addEventListener("click", () => {
    // Remove the selected class from all rows
    workerRows.forEach((row) => {
      row.classList.remove("selected");
    });

    // Add the selected class to the clicked row
    row.classList.add("selected");
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
    } else {
      list.appendChild(draggingCard);
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
  });
}
