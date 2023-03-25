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
