USE employees_db;

INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Sales & Marketing");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal & HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Developer", "75000", 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Developer", "125000", 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales", "75000", 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Director", "125000", 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", "75000", 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Finance Officer", "125000", 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources", "75000", 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Attorney", "125000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Metcalf", 1, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Codes", 1, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jes", "Silva", 7, 9);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Sales", 3, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kelly", "Ditto", 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 5, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Earl", "Johnson", 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Carol", "Lee", 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nia", "Brown", 8, NULL);