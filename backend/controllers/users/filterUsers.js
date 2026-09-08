const db = require("../../db/db");

const listUsers = (req, res) => {
  const { rol } = req.query;
  const values = [];
  let listUsersQuery = "SELECT * FROM users WHERE 1=1";

  if (rol) {
    listUsersQuery += " AND rol = ?";
    values.push(rol);
  }

  db.query(listUsersQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "No se pudieron cargar los usuarios. Inténtalo nuevamente.",
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = listUsers;
