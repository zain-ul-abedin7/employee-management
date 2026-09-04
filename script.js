let employees = JSON.parse(localStorage.getItem("employees")) || [];
const form = document.getElementById("employeeForm");
const tableBody = document.getElementById("employeeTable");
const searchInput = document.getElementById("search");
const rowTemplate = document.getElementById("employeeRowTemplate");

function saveAndRender() {
    localStorage.setItem("employees", JSON.stringify(employees));
    const text = searchInput.value.trim().toLowerCase();
    tableBody.innerHTML = "";
    
    const filtered = employees.filter(e => Object.values(e).some(v => String(v).toLowerCase().includes(text)));
    
    if (!filtered.length) {
        tableBody.innerHTML = `<tr class="empty-state"><td colspan="5">No employees found.</td></tr>`;
    } else {
        filtered.forEach(emp => {
            const tr = rowTemplate.content.cloneNode(true).querySelector("tr");
            tr.innerHTML = tr.innerHTML.replace(/{(\w+)}/g, (_, k) => emp[k] || '');
            tr.querySelector(".edit").dataset.id = emp.id;
            tr.querySelector(".delete").dataset.id = emp.id;
            tableBody.appendChild(tr);
        });
    }
    
    document.getElementById("totalEmployees").textContent = employees.length;
    document.getElementById("totalDepartments").textContent = new Set(employees.map(e => e.department.toLowerCase().trim())).size;
}

form.addEventListener("input", e => {
    if (e.target.tagName !== "INPUT") return;
    const id = form.dataset.editId;
    const val = e.target.value.trim();
    let err = "";

    if (e.target.validity.patternMismatch) {
        if (e.target.id === "name") err = "Name should contain only letters and spaces (2-50 characters).";
        else if (e.target.id === "department") err = "Department should contain only letters, spaces, or hyphens.";
        else if (e.target.id === "number") err = "Mobile number must be in format 03XXXXXXXXX.";
    } else if (e.target.validity.typeMismatch && e.target.id === "email") {
        err = "Please enter a valid email, e.g. abc@gmail.com";
    } else if (e.target.validity.valueMissing) {
        err = "This field is required.";
    }

    if (!err && e.target.id === "email" && employees.some(emp => emp.email.toLowerCase() === val.toLowerCase() && emp.id != id)) {
        err = "Email already used.";
    }
    if (!err && e.target.id === "number" && employees.some(emp => emp.number === val && emp.id != id)) {
        err = "Number already used.";
    }

    e.target.setCustomValidity(err);
    document.getElementById(e.target.id + "Error").textContent = e.target.validationMessage;
    e.target.classList.toggle("invalid", !e.target.validity.valid);
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const id = form.dataset.editId;

    if (id) {
        employees = employees.map(emp => emp.id == id ? { ...emp, ...data } : emp);
    } else {
        employees.push({ id: Date.now(), ...data });
    }
    form.reset();
    saveAndRender();
});

form.addEventListener("reset", () => {
    delete form.dataset.editId;
    document.getElementById("submitBtn").textContent = "Add Employee";
    document.getElementById("formTitle").textContent = "Add Employee";
    document.getElementById("cancelBtn").classList.add("hidden");
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("invalid"));
});

tableBody.addEventListener("click", e => {
    const id = e.target.dataset.id;
    if (!id) return;
    
    if (e.target.classList.contains("edit")) {
        const emp = employees.find(x => x.id == id);
        Object.keys(emp).forEach(k => { if (form[k]) form[k].value = emp[k]; });
        form.dataset.editId = id;
        document.getElementById("submitBtn").textContent = "Update Employee";
        document.getElementById("formTitle").textContent = "Edit Employee";
        document.getElementById("cancelBtn").classList.remove("hidden");
        form.scrollIntoView({ behavior: "smooth" });
    } else if (e.target.classList.contains("delete") && confirm("Delete employee?")) {
        employees = employees.filter(emp => emp.id != id);
        if (form.dataset.editId == id) form.reset();
        saveAndRender();
    }
});

searchInput.addEventListener("input", saveAndRender);
saveAndRender();