const mysql = require("mysql2");

// Pool de conexiones: los controladores siguen usando db.query (callbacks)
// y los scripts db.promise(), y las transacciones obtienen una conexion
// dedicada con getConnection().
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sqlCuentasdj",
  database: "inventary",
  timezone: "local",
  connectionLimit: 10,
});

module.exports = db;
