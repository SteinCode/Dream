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

const addButton = document.getElementById("add-button");
const createButton = document.getElementById("create-button");
const table = document.getElementById("user-table");
let users = [];

addButton.addEventListener("click", () => {
  const select = document.querySelector('select[name="add-user"]');
  const selectedOption = select.options[select.selectedIndex];
  const userId = selectedOption.getAttribute("data-id");
  const userName = selectedOption.textContent;
  const role = selectedOption.getAttribute("data-role");
  const row = table.insertRow(-1);
  const userNameCell = row.insertCell(0);
  const roleCell = row.insertCell(1);
  userNameCell.innerHTML = userName;
  roleCell.innerHTML = role;
  // Store user data in an array
  const userData = { id: userId, name: userName, role: role };
  users.push(userData);
  // Add an input element with the name "user-id" and the user ID as the value to the second cell
  const userIdInput = document.createElement("input");
  userIdInput.type = "hidden";
  userIdInput.name = "user-id";
  userIdInput.value = userId;
  roleCell.appendChild(userIdInput);
});

createButton.addEventListener("click", async () => {
  const projectName = document.getElementById("project-name").value;
  const users = [];
  const rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
    const userName = rows[i].cells[0].textContent;
    const role = rows[i].cells[1].textContent;
    const userIdInput = rows[i].cells[1].querySelector(
      'input[name="user-id"]'
    ).value;
    users.push({ id: userIdInput, name: userName, role: role });
  }
  fetch("/project/create-project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectName, users }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
});
