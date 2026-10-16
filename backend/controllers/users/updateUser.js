const db = require("../../db/db");

const updateUser = (req, res) => {
  const { idusers, newIdusers, rol } = req.body;

  if (!idusers || !newIdusers || !rol) {
    return res.status(400).json({
      error: "Complete todos los campos obligatorios.",
    });
  }

  const checkUserQuery = "SELECT idusers FROM users WHERE BINARY idusers = ?";

  db.query(checkUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el usuario. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El usuario no existe o ya fue eliminado.",
      });
    }

    if (newIdusers === idusers) {
      return updateUserRole(idusers, newIdusers, rol, res);
    }

    db.query(checkUserQuery, [newIdusers], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo verificar el usuario. Inténtelo de nuevo.",
        });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Ya existe una cuenta con ese usuario." });
      }

      updateUserRole(idusers, newIdusers, rol, res);
    });
  });
};

const updateUserRole = (idusers, newIdusers, rol, res) => {
  const updateUserQuery =
    "UPDATE users SET idusers = ?, rol = ? WHERE BINARY idusers = ?";

  db.query(updateUserQuery, [newIdusers, rol, idusers], (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: "Ya existe una cuenta con ese usuario." });
      }

      return res.status(500).json({
        error: "No se pudo actualizar el usuario. Inténtelo de nuevo.",
      });
    }

    return res
      .status(200)
      .json({ message: "Usuario actualizado correctamente." });
  });
};

module.exports = updateUser;
