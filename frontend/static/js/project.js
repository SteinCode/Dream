// Get the button and modal elements
const btn = document.querySelector(".create-new-project-btn");
const modal = document.querySelector(".project-modal-window");
const closeBtn = document.querySelector(".close-project-modal");

// Add a click event listener to the button
btn.addEventListener("click", function () {
  // Show the modal by setting its display property to "block"
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});
