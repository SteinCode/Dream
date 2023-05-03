const btn = document.querySelector(".code-generation-button");
const modal = document.querySelector(".invitation-modal-window");
const closeBtn = document.querySelector(".close-modal");

btn.addEventListener("click", function () {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

const generateButton = document.querySelector("#generate-button");
const generatedCode = document.querySelector("#generated-code");

generateButton.addEventListener("click", async () => {
  const response = await fetch("/generate-invitation-code", {
    method: "POST",
  });
  const data = await response.json();

  // Set the generated code as the value of the input field
  generatedCode.value = data.code;
});

//PUT
// Get all datetime-local input elements
const datetimeInputs = document.querySelectorAll(
  'input[type="datetime-local"]'
);

// Loop through each input element
datetimeInputs.forEach((input) => {
  // Add a change event listener to the input element
  input.addEventListener("change", (event) => {
    // Log the code and the new expiration time to the console
    const code =
      event.target.parentNode.parentNode.parentNode.querySelector(
        "td:first-child"
      ).textContent;
    const newExpirationTime = event.target.value;
    // Send a PUT request to update the expiration time of the code
    fetch(`/update-code-expiration-date/${code}`, {
      method: "PUT",
      body: JSON.stringify({ expiration_time: newExpirationTime }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(
          `Code ${code} expiration time updated to ${newExpirationTime}`
        );
      })
      .catch((error) => {
        console.error(`Error updating code ${code} expiration time: ${error}`);
      });
  });
});
