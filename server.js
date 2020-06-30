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