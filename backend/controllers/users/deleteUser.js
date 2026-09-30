const db = require("../../db/db");

const listUsers = async (req, res) => {
  const { idusers, tokenUser } = req.params;

  if (!idusers || !tokenUser) {
    return res.status(400).json({
      error: "No se pudo identificar al usuario que desea eliminar.",
    });
  }

  if (idusers === tokenUser) {
    return res.status(400).json({
      error: "No puede eliminar su propia cuenta.",
    });
  }

  const deleteUserQuery = "DELETE FROM users WHERE BINARY idusers = ?";

  db.query(deleteUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo eliminar el usuario. Inténtelo de nuevo.",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({
        error: "El usuario no existe o ya fue eliminado.",
      });
    }

    return res
      .status(200)
      .json({ message: "Usuario eliminado correctamente." });
  });
};

module.exports = listUsers;
