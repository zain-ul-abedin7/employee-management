let employees = JSON.parse(localStorage.getItem("employees")) || [];

showEmployees();

document.getElementById("employeeForm").onsubmit = function(e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let department = document.getElementById("department").value.trim();
    let number = document.getElementById("number").value.trim();
    let error = document.getElementById("error");

    if (!name || !email || !department || !number) {
        error.innerHTML = "Please fill all fields";
        return;
    }

    if (!email.includes("@")) {
        error.innerHTML = "Please enter a valid email";
        return;
    }

    employees.push({
        id: Date.now(),
        name,
        email,
        department,
        number
    });

    localStorage.setItem("employees", JSON.stringify(employees));

    this.reset();
    error.innerHTML = "";

    showEmployees();
};


function showEmployees() {

    let table = document.getElementById("employeeTable");

    table.innerHTML = employees.map(e => `
        <tr>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.department}</td>
            <td>${e.number}</td>
            <td>
                <button class="delete" onclick="deleteEmployee(${e.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


function deleteEmployee(id) {

    employees = employees.filter(e => e.id != id);

    localStorage.setItem("employees", JSON.stringify(employees));

    showEmployees();
}


document.getElementById("search").oninput = function() {

    let text = this.value.toLowerCase();

    let rows = employees.filter(e =>
        e.name.toLowerCase().includes(text)
    );

    document.getElementById("employeeTable").innerHTML = rows.map(e => `
        <tr>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.department}</td>
            <td>${e.number}</td>
            <td>
                <button class="delete" onclick="deleteEmployee(${e.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
};