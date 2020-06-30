// Dependency
const mysql = require(`mysql`);
const cTable = require(`console.table`);

// DB connection
const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `employees_db`
});
// Connect
connection.connect((err) => {
    if (err) throw err;
});

// called by callDep() in server.js, returns array of Department names
const queryDep = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
    })
};

// called by viewDep, returns table of employees by department
const queryEmpByDep = (id) => {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee INNER JOIN employee AS manager ON employee.manager_id = manager.id  INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id WHERE department.id = ${id}`,
        (err, res) => {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log(table);
        })
}

// called by callEmp, returns table
const queryEmp = () => {
    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
    })
};

// called by addEmp, returns table
const queryRole = () => {
    connection.query(`SELECT id, title FROM role`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
    })
};

// sends addEmp() info  to MySQL Database
const empSQL = (newEmp) => {
    connection.query(`INSERT INTO employee SET ?`, newEmp, (err, res) => {
        if (err) throw err;
    })
}

// sends addDep() info to MySQL Database
const depSQL = (newDep) => {
    connection.query(`INSERT INTO department SET ?`, newDep, (err, res) => {
        if (err) throw err;
    })
}

// sends addRole() info to MySQL Database
const roleSQL = (newRole) => {
    connection.query(`INSERT INTO role SET ?`, newRole, (err, res) => {
        if (err) throw err;
    })
}

const updateRoleSQL = (updateRole) => {
    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, updateRole, (err, res) => {
        if (err) throw err;
        console.log(`Rows affected`, res.affectedRows);
    })
}

// Export as Obj
module.exports = {
    queryDep: queryDep,
    queryEmpByDep: queryEmpByDep,
    queryEmp: queryEmp,
    queryRole: queryRole,
    empSQL: empSQL,
    depSQL: depSQL,
    roleSQL: roleSQL,
    updateRoleSQL: updateRoleSQL
};