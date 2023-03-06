import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tasks");
  }

  async getHtml() {
    //sitoje vietoje reiks pasiimti duomenis is database su fetch api arba ajax
    return `
<div class='app'>
<main class='project'>
<div class='project-info'>
<div class='project-participants'>
<span></span>
<span></span>
<span></span>
<button class='project-participants__add'>Add Participant</button>
</div>
</div>
<div class='project-tasks'>
<div class='project-column'>
<div class='project-column-heading'>
<h2 class='project-column-heading__title'>To do</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
</div>
<div class='task' draggable='true'>
<div class='task__tags'><span class='task__tag task__tag--easy'>Easy</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
<p>Finish task page</p>
<div class='task__stats'>
<span><img style="opacity:0.5" width="15px" src="/static/media/comments.svg" /> 3</span>
<span><img style="opacity:0.5" width="15px" src="/static/media/user.svg" /> unassigned</span>
</div>
</div>
</div>
<div class='project-column'><div class='project-column-heading'>
<h2 class='project-column-heading__title'>In Progress</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
</div>
<div class='task' draggable='true'>
<div class='task__tags'><span class='task__tag task__tag--medium'>Medium</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
<p>Replace lorem ipsum text in the final designs</p>
<div class='task__stats'>
<span><img style="opacity:0.5" width="15px" src="/static/media/comments.svg" /> 0</span>
<span><img style="opacity:0.5" width="15px" src="/static/media/user.svg" /> Green velvet</span>
</div>
</div>
</div>
<div class='project-column'><div class='project-column-heading'>
<h2 class='project-column-heading__title'>Needs Review</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
</div>
<div class='task' draggable='true'>
<div class='task__tags'><span class='task__tag task__tag--hard'>Hard</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
<p>Check the company we copied doesn't think we copied them.</p>
<div class='task__stats'>
<span><img style="opacity:0.5" width="15px" src="/static/media/comments.svg" /> 0</span>
<span><img style="opacity:0.5" width="15px" src="/static/media/user.svg" /> unassigned</span>
</div>
</div>
</div>
<div class='project-column'><div class='project-column-heading'>
<h2 class='project-column-heading__title'>Done</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
</div>
<div class='task' draggable='true'>
<div class='task__tags'><span class='task__tag task__tag--easy'>Easy</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
<p>Send Advert illustrations over to production company.</p>
<div class='task__stats'>
<span><img style="opacity:0.5" width="15px" src="/static/media/comments.svg" /> 3</span>
<span><img style="opacity:0.5" width="15px" src="/static/media/user.svg" /> Green velvet</span>
</div>
</div>
</div>
</div>
</main>
</div>
    `;
  }
}

/* Task page js*/

document.addEventListener("DOMContentLoaded", (event) => {
  var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = "0.1";
    this.style.border = "3px dashed #c4cad3";

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
