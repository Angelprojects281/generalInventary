const db = require("../../db/db");

const listUsers = async (req, res) => {
  const { idusers, tokenUser } = req.params;

  if (!idusers || !tokenUser) {
    return res.status(400).json({ message: "Error, faltan campos necesarios" });
  }

  if (idusers === tokenUser) {
    return res
      .status(400)
      .json({ error: "Error, no puedes eliminarte a ti mismo" });
  }

  const deleteUserQuery = "DELETE FROM users WHERE BINARY idusers = ?";

  db.query(deleteUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el usuario" });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: "Error, el usuario no existe" });
    }

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  });
};

module.exports = listUsers;
