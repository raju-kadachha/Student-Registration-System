// Get the form and table body
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTable");

// Get input fields
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const addStd = document.getElementById("addStd");

// Table wrapper
const tableWrapper = document.querySelector(".table-wrap");

// Main array to store students
let students = [];
let editIndex = -1;

// Load students from localStorage
function loadData() {
    const savedData = localStorage.getItem("students");
    if (savedData) {
        students = JSON.parse(savedData);
        displayStudents();
    }
}
loadData();

// Clear input fields
function clearInputs() {
    nameInput.value = "";
    idInput.value = "";
    emailInput.value = "";
    contactInput.value = "";
}

// Display students in table
function displayStudents() {
    tableBody.innerHTML = "";

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="tname">${student.name}</td>
      <td class="tid">${student.id}</td>
      <td class="temail">${student.email}</td>
      <td class="tcontact">${student.contact}</td>
      <td>
        <button onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})">Delete</button>
      </td>
    `;
        tableBody.appendChild(row);
    }
}

// Form submit (add/update)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const id = idInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    if (!name || !id || !email || !contact) {
        return; // skip empty field handling for now
    }

    // Check duplicates (basic)
    for (let i = 0; i < students.length; i++) {
        if (editIndex === i) continue;
        if (students[i].id === id || students[i].email === email || students[i].contact === contact) {
            return; // skip duplicates for now
        }
    }

    const student = { name, id, email, contact };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        addStd.innerText = "Add Student";
    }

    saveData();
    displayStudents();
    clearInputs();
});

// Edit student
function editStudent(index) {
    const student = students[index];
    nameInput.value = student.name;
    idInput.value = student.id;
    emailInput.value = student.email;
    contactInput.value = student.contact;
    addStd.innerText = "✏️ Update";
    editIndex = index;
}

// Delete student
function deleteStudent(index) {
    students.splice(index, 1);
    saveData();
    displayStudents();
}

// Save to localStorage
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}
