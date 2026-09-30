const db = require("../../db/db");

const listUsers = (req, res) => {
  const { rol } = req.query;
  const values = [];
  let listUsersQuery = "SELECT idusers, rol FROM users WHERE 1=1";

  if (rol) {
    listUsersQuery += " AND rol = ?";
    values.push(rol);
  }

  db.query(listUsersQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los usuarios. Inténtelo de nuevo.",
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = listUsers;
