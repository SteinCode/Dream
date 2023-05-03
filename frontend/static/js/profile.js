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

window.addEventListener("beforeunload", function () {
  // Save the value of the checkbox to local storage
  localStorage.setItem("passwordChecked", formSwitch.checked);
});

//Fetch user id
let userId;
document.addEventListener("DOMContentLoaded", () => {
  fetch("/user/get-logged-user")
    .then((response) => response.json())
    .then((data) => {
      userId = data.userId;
      // use the user ID in your JavaScript code
    })
    .catch((error) => {
      console.error("Error fetching user ID:", error);
    });
});

//Delete button
const deleteButton = document.querySelector(".delete-user");
deleteButton.addEventListener("click", (event) => {
  //console.log("---------------------" + userId);
  event.preventDefault();
  fetch(`/profile/delete-user/${userId}`, {
    method: "DELETE",
    credentials: "same-origin",
  })
    .then((response) => {
      if (response.ok) {
        // User was deleted successfully, redirect to /login page
        window.location.href = "/login";
      } else {
        throw new Error("Failed to delete user");
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle the error here
    });
});
