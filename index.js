const inquirer = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  employeeCMS();
});

var employeeCMS = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "What would you like to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Log Out",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View Departments") {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          console.log("Viewing Departments: ");
          console.table(result);
          employeeCMS();
        });
      } else if (answers.prompt === "View Roles") {
        db.query(`SELECT * FROM role`, (err, result) => {
          if (err) throw err;
          console.log("Viewing Roles: ");
          console.table(result);
          employeeCMS();
        });
      } else if (answers.prompt === "View Employees") {
        db.query(`SELECT * FROM employee`, (err, result) => {
          if (err) throw err;
          console.log("Viewing Employees: ");
          console.table(result);
          employeeCMS();
        });
      } else if (answers.prompt === "Add Department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department",
              message: "What is the dpeartment name?",
            },
          ])
          .then((answers) => {
            db.query(
              `INSERT INTO department (name) VALUES (?)`,
              [answers.department],
              (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.department} to the database.`);
                employeeCMS();
              }
            );
          });
      } else if (answers.prompt === "Add Role") {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Role name?",
              },
              {
                type: "input",
                name: "salary",
                message: "Role salary?",
              },
              {
                type: "list",
                name: "department",
                message: "Role department?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
                  }
                  return array;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                  var department = result[i];
                }
              }

              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [answers.role, answers.salary, department.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to the database.`);
                  employeeCMS();
                }
              );
            });
        });
      } else if (answers.prompt === "Add Employee") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Employees first name?",
              },
              {
                type: "input",
                name: "lastName",
                message: "Employees last name?",
              },
              {
                type: "list",
                name: "role",
                message: "Employees role?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
              {
                type: "input",
                name: "manager",
                message: "Employees manager?",
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }

              db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                [
                  answers.firstName,
                  answers.lastName,
                  role.id,
                  answers.manager.id,
                ],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Added ${answers.firstName} ${answers.lastName} to the database.`
                  );
                  employeeCMS();
                }
              );
            });
        });
      } else if (answers.prompt === "Update Employee Role") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Employee role to update?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].last_name);
                  }
                  var employeeArray = [...new Set(array)];
                  return employeeArray;
                },
              },
              {
                type: "list",
                name: "role",
                message: "New employee role?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === answers.employee) {
                  var name = result[i];
                }
              }

              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }

              db.query(
                `UPDATE employee SET ? WHERE ?`,
                [{ role_id: role }, { last_name: name }],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Updated ${answers.employee} role to the database.`
                  );
                  employeeCMS();
                }
              );
            });
        });
      } else if (answers.prompt === "Log Out") {
        db.end();
        console.log("Thank you for using Employee CMS!");
      }
    });
};
