// Get the client
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "youtube",
  port: "3307",
  dateStrings: true,
});

module.exports = connection;
