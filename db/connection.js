const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: "Apharahmain99",
  database: "employee_tracker_db",
});

module.exports = db;
