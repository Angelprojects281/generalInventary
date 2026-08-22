const db = require("../../db/db");

const listUsers = (req, res) => {
  const { rol } = req.body;
  const values = [];
  let listUsersQuery = "SELECT * FROM users WHERE 1=1";

  if (rol) {
    listUsersQuery += " AND rol = ?";
    values.push(rol);
  }

  db.query(listUsersQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al listar los usuarios" });
    }

    return res.status(200).json(results);
  });
};

module.exports = listUsers;
