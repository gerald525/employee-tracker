// Dependecies
const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const query = require(`./queries`);

// DB connection
const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `employees_db`
});
// Connect and begin
connection.connect((err) => {
    if (err) throw err;
    welcomeAscii();
});


function welcomeAscii() {
    console.log(String.raw);
    userQuery();
}

// Begin Inquirer
const userQuery = () => {
    console.log(`Welcome to Employee Tracker.`)
    // given options
    return inquirer.prompt(
        {
            type: `list`,
            name: `userTask`,
            message: `What would you like to do?`,
            choices: [
                `View Employees, Departments or Roles`,
                `Add Employees, Departments or Roles`,
                `Update Employee Roles`,
                `Exit.`
            ]
        })
        // switch/case to call functions
        .then((response) => {
            switch (response.userTask) {
                case `View Employees, Departments or Roles`:
                    viewOptions();
                    break;
                case `Add Employees, Departments or Roles`:
                    addOptions();
                    break;
                case `Update Employee Roles`:
                    changeRole();
                    break;
                case `Exit.`:
                    end();
                    break;
            }
        });
};

// viewOptions() sends user to the right functions below
const viewOptions = () => {
    return inquirer.prompt([
        {
            type: `list`,
            name: `viewChoice`,
            message: `What would you like to view?`,
            choices: [`All Employees`, `Employees by Department`, `Departments`, `Roles`]
        }
    ]).then(response => {
        switch (response.viewChoice) {
            case `All Employees`:
                callEmp();
                break;
            case `Employees by Department`:
                callDep();
                break;
            case `Departments`:
                viewDep();
                break;
            case `Roles`:
                viewRole();
                break;
        }
    })
}

// sends user to the right functions below
const addOptions = () => {
    return inquirer.prompt([
        {
            type: `list`,
            name: `addChoice`,
            message: `What would you like to add?`,
            choices: [`Employee`, `Department`, `Role`]
        }
    ]).then(response => {
        switch (response.addChoice) {
            case `Employee`:
                addEmp();
                break;
            case `Department`:
                addDep();
                break;
            case `Role`:
                addRole();
                break;
        }
    })
}

// restarts inquirer or quits
const keepGoing = () => {
    inquirer.prompt([
        {
            type: `list`,
            name: `yesNo`,
            message: `Would you like to do more?`,
            choices: [`Yes`, `No`]
        }
    ]).then(response => {
        if (response.yesNo === `Yes`) {
            userQuery();
        }
        else {
            end();
        }
    })
};

// callEmp() & callDep() use queries.js
const callEmp = () => {
    query.queryEmp();
    setTimeout(() => keepGoing(), 500);
};

// callDep() displays array of choices with id's from DB
const callDep = () => {
    query.queryDep();
    setTimeout(() => showDep(), 500);
};

// pulls up all current departments
const showDep = () => {
    return inquirer.prompt([
        {
            type: `input`,
            name: `allDeps`,
            message: `Which Department? Enter ID number:`
        }
    ]).then(response => {
        let dep = response.allDeps;
        query.queryEmpByDep(dep);
        setTimeout(() => keepGoing(), 500)
    })
};

// uses queryRole() in queries.js
const viewRole = () => {
    query.queryRole();
    setTimeout(() => keepGoing(), 500)
};

// uses queryDep() in queries.js
const viewDep = () => {
    query.queryDep();
    setTimeout(() => keepGoing(), 500)
};


// walks user through creating a new employee, sends it to empSQL() below
const newEmp = {};
const addEmp = () => {
    inquirer.prompt([
        {
            type: `input`,
            name: `firstName`,
            message: `What is the person's first name?`
        },
        {
            type: `input`,
            name: `lastName`,
            message: `What is their last name?`
        }
    ]).then(response => {
        // add name to newEmp{}
        newEmp.first_name = response.firstName;
        newEmp.last_name = response.lastName;
        // query for available roles
        connection.query(`SELECT id, title FROM role`, (err, res) => {
            const roles = [];
            if (err) throw err;
            for (i in res) {
                roles.push(res[i].title);
            }
            inquirer.prompt([
                {
                    type: `list`,
                    name: `role`,
                    message: `Select employee's role:`,
                    choices: roles
                }
            ]).then(response => {
                // convert response.role to an ID based on index, add to newEmp{}
                roles.forEach((role, index) => {
                    if (role === response.role) {
                        newEmp.role_id = index + 1;
                    }
                })
                // query for current managers
                connection.query(`SELECT employee.id, concat(manager.first_name, " ", manager.last_name) AS manager_name FROM employee INNER JOIN employee AS manager ON manager.id = employee.manager_id`,
                    (err, res) => {
                        const managers = [];
                        if (err) throw err;
                        // filter out dupes, keep just the names
                        let temp = [...new Set(res.map(res => res.manager_name))]
                        for (i in temp) {
                            managers.push(temp[i]);
                        }
                        // add null as the last option
                        managers.push(`null`);
                        inquirer.prompt([
                            {
                                type: `list`,
                                name: `manager`,
                                message: `Select employee's manager:`,
                                choices: managers
                            }
                        ])
                            // convert manager name to ID, like with roles
                            .then(response => {
                                managers.forEach((human, index) => {
                                    if (response.manager === `null`) {
                                        newEmp.manager_id = `null`;
                                    }
                                    else if (human === response.manager) {
                                        newEmp.manager_id = index + 1;
                                    }
                                })
                                console.log(newEmp);
                                // pass newEmp{} to empSQL in queries.js
                                query.empSQL(newEmp);
                                keepGoing();
                            })
                    })
            })
        })
    })
};

// walks use through creating new Department, sends to queries.js
const newDep = {};
const addDep = () => {
    return inquirer.prompt([
        {
            type: `input`,
            name: `depName`,
            message: `What is the Department's name?`
        }
    ]).then(response => {
        newDep.name = response.depName;
        query.depSQL(newDep);
        keepGoing();
    })
};

// walks use through creating new Role, sends to queries.js
const newRole = {};
const addRole = () => {
    return inquirer.prompt([
        {
            type: `input`,
            name: `roleTitle`,
            message: `What is the Role's title?`
        },
        {
            type: `input`,
            name: `roleSalary`,
            message: `What is the Role's salary? (No $ or comma)`
        }
    ]).then(response => {
        newRole.title = response.roleTitle;
        newRole.salary = response.roleSalary;
        query.queryDep();
    }).then(() => {
        inquirer.prompt([
            {
                type: `input`,
                name: `roleDepId`,
                message: `Enter Department ID number:`
            }
        ]).then(response => {
            newRole.department_id = response.roleDepId;
            query.roleSQL(newRole);
            keepGoing();
        })
    })
};

// walks use through updating an employee's Role, sends to queries.js
const updateRole = [];
const changeRole = () => {
    query.queryEmp();
    setTimeout(() => inquirer.prompt([
        {
            type: `input`,
            name: `empId`,
            message: `Enter Employee ID to change role:`
        }
    ]).then(response => {
        updateRole.push(response.empId);
        query.queryRole();
    }).then(() => {
        setTimeout(() => inquirer.prompt([
            {
                type: `input`,
                name: `newRoleId`,
                message: `Enter the ID of new role:`
            }
        ]).then(response => {
            updateRole.push(response.newRoleId);
            /* info collected makes sense from user view,
                but its backwards in the array */
            query.updateRoleSQL([updateRole[1], updateRole[0]]);
            keepGoing();
        }), 500)
    }), 500)
};

// BYE BYE
const end = () => {
    connection.end();
    return console.log(`Thanks for using Employee Tracker.`);
};