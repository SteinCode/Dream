// Get the button and modal elements
const btn = document.querySelector(".create-new-project-btn");
const modal = document.querySelector(".project-modal-window");
const closeBtn = document.querySelector(".close-modal");

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
  const {dataset, textContent} = select.options[select.selectedIndex];
  const {id: userId, role} = dataset;
  
  const rowHtml = `
    <tr>
      <td>${textContent}</td>
      <td>${role}</td>
      <input type="hidden" name="user-id" value="${userId}">
    </tr>
  `;
  table.insertAdjacentHTML('beforeend', rowHtml);

  // Store user data in an object and push it to the users array
  const userData = { id: userId, name: textContent, role };
  users.push(userData);
});

createButton.addEventListener("click", async () => {
  const projectNameInput = document.getElementById("project-name");
  const projectName = projectNameInput.value;
  const tableRows = Array.from(table.rows);
  const users = tableRows.map(row => {
    const [userName, role] = row.cells;
    const userId = row.querySelector('input[name="user-id"]').value;
    return { id: userId, name: userName.textContent, role: role.textContent };
  });
  try {
    const response = await fetch("/project/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName, users }),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});
