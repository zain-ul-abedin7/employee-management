let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editId = null;
 
const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const error = document.getElementById("error");
const submitBtn = document.getElementById("submitBtn");
 
function validateEmployee(data, excludeId) {
 
    if (!data.name || !data.email || !data.department || !data.number) {
        return "Please fill all fields";
    }
 
    if (!/^[A-Za-z ]{2,50}$/.test(data.name)) {
        return "Enter a valid name";
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return "Enter a valid email";
    }
 
    if (!/^[A-Za-z ]+$/.test(data.department)) {
        return "Enter a valid department";
    }
 
    if (!/^03\d{9}$/.test(data.number)) {
        return "Enter a valid  11 digit number along with 03";
    }
 
    if (employees.some(emp => emp.email.toLowerCase() == data.email.toLowerCase() && emp.id != excludeId)) {
        return "Email already exists";
    }
 
    if (employees.some(emp => emp.number == data.number && emp.id != excludeId)) {
        return "Mobile number already exists";
    }
 
    return "";
}
 
function getFormData() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        number: document.getElementById("number").value.trim()
    };
}
 
function addEmployee(data) {
    employees.push({
        id: Date.now(),
        name: data.name,
        email: data.email,
        department: data.department,
        number: data.number
    });
}
 
function updateEmployee(id, data) {
    employees = employees.map(emp =>
        emp.id == id ? { ...emp, ...data } : emp
    );
}
 
function deleteEmployee(id) {
    employees = employees.filter(e => e.id != id);
 
    if (editId == id) {
        resetForm();
    }
 
    saveAndRender();
}
 
function saveAndRender() {
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable(employees);
}
 
function resetForm() {
    editId = null;
    form.reset();
    submitBtn.textContent = "Add Employee";
    error.textContent = "";
}
 
function loadEmployeeIntoForm(id) {
    let emp = employees.find(e => e.id == id);
    if (!emp) return;
 
    document.getElementById("name").value = emp.name;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("number").value = emp.number;
 
    editId = id;
    submitBtn.textContent = "Update Employee";
    error.textContent = "";
 
    form.scrollIntoView({ behavior: "smooth" });
}
 
function renderTable(list) {
    table.innerHTML = "";
 
    list.forEach(e => {
        const row = document.createElement("tr");
 
        const nameCell = document.createElement("td");
        nameCell.textContent = e.name;
 
        const emailCell = document.createElement("td");
        emailCell.textContent = e.email;
 
        const deptCell = document.createElement("td");
        deptCell.textContent = e.department;
 
        const numberCell = document.createElement("td");
        numberCell.textContent = e.number;
 
        const actionsCell = document.createElement("td");
 
        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "Edit";
        editBtn.dataset.id = e.id;
 
        const delBtn = document.createElement("button");
        delBtn.className = "delete";
        delBtn.textContent = "Delete";
        delBtn.dataset.id = e.id;
 
        actionsCell.append(editBtn, delBtn);
 
        row.append(nameCell, emailCell, deptCell, numberCell, actionsCell);
        table.appendChild(row);
    });
}
 
form.onsubmit = function(e) {
    e.preventDefault();
 
    const data = getFormData();
    const errorMsg = validateEmployee(data, editId);
 
    if (errorMsg) {
        error.textContent = errorMsg;
        return;
    }
 
    if (editId) {
        updateEmployee(editId, data);
    } else {
        addEmployee(data);
    }
 
    resetForm();
    saveAndRender();
};
 
document.getElementById("search").oninput = function() {
    const text = this.value.toLowerCase();
    const result = employees.filter(e => e.name.toLowerCase().includes(text));
    renderTable(result);
};
 
table.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit")) {
        loadEmployeeIntoForm(e.target.dataset.id);
    }
 
    if (e.target.classList.contains("delete")) {
        deleteEmployee(e.target.dataset.id);
    }
});
 
renderTable(employees);
 