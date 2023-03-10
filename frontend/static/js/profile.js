const formSwitch = document.querySelector(
  '.form-switch input[type="checkbox"]'
);
const togglePassword = document.querySelector(".toggle-password");

// Hide toggle-password section by default
togglePassword.style.display = "none";

// When the form switch is clicked
formSwitch.addEventListener("click", () => {
  // Toggle the display of the toggle-password section
  togglePassword.style.display =
    togglePassword.style.display === "none" ? "block" : "none";
});
