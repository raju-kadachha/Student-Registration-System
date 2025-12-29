// get the form and table body
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTable");

// get input fields
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const addStd = document.getElementById("addStd");

// Table Box
const tableWrapper = document.querySelector(".table-wrap");

// main array to store students
let students = [];
let editIndex = -1;

// load students from localStorage 
function loadData() {
    const savedData = localStorage.getItem("students");
    if (savedData) {
        students = JSON.parse(savedData);
        displayStudents();
    }
}
loadData();

//  form submit
form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload

    const name = nameInput.value.trim();
    const id = idInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    // empty field check
    if (!name || !id || !email || !contact) {
        notify("Please fill all fields", "⚠️");
        return;
    }

    //validate all input - regex used
    if (!validateInputs(name, id, email, contact)) return;

    // check for duplicates
    for (let i = 0; i < students.length; i++) {
        if (editIndex === i) continue; // skip editing row
        if (students[i].id === id) {
            notify("Student ID already exists", "❌");
            return;
        }
        if (students[i].email === email) {
            notify("Email already exists", "❌");
            return;
        }
        if (students[i].contact === contact) {
            notify("Contact number already exists", "❌");
            return;
        }
    }

    const student = { name, id, email, contact };

    // add new student or update existing
    if (editIndex === -1) {
        students.push(student);
        notify("Student added successfully", "✔️");
    } else {
        students[editIndex] = student;
        editIndex = -1;
        addStd.innerText = "Add Student";
        notify("Student updated successfully", "✔️");
    }

    saveData();
    displayStudents();
    clearInputs();
});

// clear input fields
function clearInputs() {
    nameInput.value = "";
    idInput.value = "";
    emailInput.value = "";
    contactInput.value = "";
}

// display students in table
function displayStudents() {
    tableBody.innerHTML = ""; // clear table

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

    // add scroll 
    if (students.length >= 7) {
        tableWrapper.classList.add("scroll");
    } else {
        tableWrapper.classList.remove("scroll");
    }
}

// edit student
function editStudent(index) {
    nameInput.focus(); //shift focus to name
    const student = students[index];
    nameInput.value = student.name;
    idInput.value = student.id;
    emailInput.value = student.email;
    contactInput.value = student.contact;
    addStd.innerText = "✏️ Update";

    editIndex = index;
}

// delete student
function deleteStudent(index) {
    if (confirm("Do you want to delete this record?")) {
        students.splice(index, 1);
        saveData();
        displayStudents();
        notify("Student deleted successfully", "🗑️");
    }
}

// save students to localStorage
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

// show notification
function notify(message, icon = "") {
    const notifyDiv = document.getElementById("notify");
    const msgDiv = document.getElementById("notify-msg");

    msgDiv.textContent = icon + " " + message;
    notifyDiv.style.display = "flex";

    const main = document.querySelector("main");
    if (main) main.style.filter = "blur(1px)";

    setTimeout(() => {
        notifyDiv.style.display = "none";
        if (main) main.style.filter = "none";
    }, 2000);
}

//validating all inputs regex
function validateInputs(name, id, email, contact) {
    // Name: letters and spaces only
    if (!/^[A-Za-z ]+$/.test(name)) {
        notify("Name must contain letters and spaces only", "⚠️");
        return false;
    }

    // ID: exactly 6 digits
    if (!/^\d{6}$/.test(id)) {
        notify("Student ID must be exactly 6 digits", "⚠️");
        return false;
    }

    // Email: basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        notify("Enter a valid email address", "⚠️");
        return false;
    }

    // Contact: 10 digits starting 6-9
    if (!/^[6-9]\d{9}$/.test(contact)) {
        notify("Enter a valid 10-digit Indian mobile number", "⚠️");
        return false;
    }

    return true;
}
