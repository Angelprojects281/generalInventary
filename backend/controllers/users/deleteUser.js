const db = require("../../db/db");

const listUsers = async (req, res) => {
  const { idusers, tokenUser } = req.params;

  if (!idusers || !tokenUser) {
    return res.status(400).json({
      message: "Faltan datos obligatorios para eliminar el usuario.",
    });
  }

  if (idusers === tokenUser) {
    return res.status(400).json({
      error: "No puedes eliminar tu propio usuario.",
    });
  }

  const deleteUserQuery = "DELETE FROM users WHERE BINARY idusers = ?";

  db.query(deleteUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "No se pudo eliminar el usuario. Inténtalo nuevamente.",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({
        message: "El usuario no existe o ya fue eliminado.",
      });
    }

    return res
      .status(200)
      .json({ message: "Usuario eliminado correctamente." });
  });
};

module.exports = listUsers;
