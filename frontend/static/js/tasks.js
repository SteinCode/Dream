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

// // Task dragging logic
// document.addEventListener("DOMContentLoaded", (event) => {
//   var dragSrcEl = null;

//   function handleDragStart(e) {
//     this.style.outline = "3px dashed #c4cad3";

//     dragSrcEl = this;

//     e.dataTransfer.effectAllowed = "move";
//     e.dataTransfer.setData("text/html", this.innerHTML);
//   }

//   function handleDragOver(e) {
//     if (e.preventDefault) {
//       e.preventDefault();
//     }

//     e.dataTransfer.dropEffect = "move";

//     return false;
//   }

//   function handleDragEnter(e) {
//     this.classList.add("task-hover");
//   }

//   function handleDragLeave(e) {
//     this.classList.remove("task-hover");
//   }

//   function handleDrop(e) {
//     if (e.stopPropagation) {
//       e.stopPropagation(); // stops the browser from redirecting.
//     }

//     if (dragSrcEl != this) {
//       dragSrcEl.innerHTML = this.innerHTML;
//       this.innerHTML = e.dataTransfer.getData("text/html");
//     }

//     return false;
//   }

//   function handleDragEnd(e) {
//     this.style.opacity = "1";
//     this.style.border = 0;

//     items.forEach(function (item) {
//       item.classList.remove("task-hover");
//     });
//   }

//   let items = document.querySelectorAll(".task");
//   items.forEach(function (item) {
//     item.addEventListener("dragstart", handleDragStart, false);
//     item.addEventListener("dragenter", handleDragEnter, false);
//     item.addEventListener("dragover", handleDragOver, false);
//     item.addEventListener("dragleave", handleDragLeave, false);
//     item.addEventListener("drop", handleDrop, false);
//     item.addEventListener("dragend", handleDragEnd, false);
//   });
// });


let cards = document.querySelectorAll('.task-card');
let lists = document.querySelectorAll('.task-list');


cards.forEach((card)=>{
    registerEventsOnCard(card);
});

lists.forEach((list)=>{
    list.addEventListener('dragover', (e)=>{
        e.preventDefault();
        let draggingCard = document.querySelector('.dragging');
        let cardAfterDraggingCard = getCardAfterDraggingCard(list, e.clientY);
        if(cardAfterDraggingCard){
            
                cardAfterDraggingCard.parentNode.insertBefore(draggingCard, cardAfterDraggingCard);
        } else{
            list.appendChild(draggingCard);
        }
        
    });
});

function getCardAfterDraggingCard(list, yDraggingCard){

    let listCards = [...list.querySelectorAll('.task-card:not(.dragging)')];

    return listCards.reduce((closestCard, nextCard)=>{
        let nextCardRect = nextCard.getBoundingClientRect();
        let offset = yDraggingCard - nextCardRect.top - nextCardRect.height /2;

        if(offset < 0 && offset > closestCard.offset){
            return {offset, element: nextCard}
        } else{
            return closestCard;
        }
    
    }, {offset: Number.NEGATIVE_INFINITY}).element;

}

function registerEventsOnCard(card){
    card.addEventListener('dragstart', (e)=>{
        card.classList.add('dragging');
    });


    card.addEventListener('dragend', (e)=>{
        card.classList.remove('dragging');
    });
}
