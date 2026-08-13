const db = require("../../db/db");

const listUsers = async (req, res) => {
  const listUsersQuery = "SELECT idusers, rol FROM users";

  db.query(listUsersQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al listar los usuarios" });
    }

    return res.status(200).json(results);
  });
};

module.exports = listUsers;
