// get the form and table body
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTable");

// get input fields
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const addStd = document.getElementById("addStd");

// table wrapper
const tableWrapper = document.querySelector(".table-wrap");

// main data
let students = [];
let editIndex = -1;

/* load data from localStorage */
function loadData() {
    const saved = localStorage.getItem("students");
    if (saved) {
        students = JSON.parse(saved);
        displayStudents();
    }
}
loadData();

/* form submit */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const id = idInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    // basic empty check
    if (!name || !id || !email || !contact) {
        alert("Please fill all fields");
        return;
    }

    const student = { name, id, email, contact };

    if (editIndex === -1) {
        students.push(student);
        alert("Student added successfully");
    } else {
        students[editIndex] = student;
        editIndex = -1;
        addStd.innerText = "Add Student";
        alert("Student updated successfully");
    }

    saveData();
    displayStudents();
    clearInputs();
});

/* clear form */
function clearInputs() {
    nameInput.value = "";
    idInput.value = "";
    emailInput.value = "";
    contactInput.value = "";
}

/* display students */
function displayStudents() {
    tableBody.innerHTML = "";

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td class="tname">${student.name}</td>
      <td class="tid">${student.id}</td>
      <td class="temail">${student.email}</td>
      <td class="tcontact">${student.contact}</td>
      <td class="taction">
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

        tableBody.appendChild(row);
    });

    // table scroll
    if (students.length >= 7) {
        tableWrapper.classList.add("scroll");
    } else {
        tableWrapper.classList.remove("scroll");
    }
}

/* edit student */
function editStudent(index) {
    const s = students[index];
    nameInput.value = s.name;
    idInput.value = s.id;
    emailInput.value = s.email;
    contactInput.value = s.contact;
    editIndex = index;
    addStd.innerText = "Update";
}

/* delete student */
function deleteStudent(index) {
    if (confirm("Do you want to delete this record?")) {
        students.splice(index, 1);
        saveData();
        displayStudents();
    }
}

/* save data */
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}
