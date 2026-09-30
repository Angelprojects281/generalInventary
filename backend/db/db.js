const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sqlCuentasdj",
  database: "inventary",
  timezone: "local",
});

db.connect((err) => {
  if (err) {
    console.error("No se pudo conectar con la base de datos:", err);
    return;
  }
});

module.exports = db;
