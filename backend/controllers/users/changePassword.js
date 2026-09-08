const db = require("../../db/db");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");

const changePassword = async (req, res) => {
  const { idusers, newPassword, confirmPassword } = req.body;

  if (!idusers || !newPassword || !confirmPassword) {
    return res.status(400).json({
      error: "Faltan datos obligatorios para cambiar la contraseña.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: "Las contraseñas no coinciden. Verifica la confirmación.",
    });
  }

  const passwordStrength = zxcvbn(newPassword);

  if (passwordStrength.score < 3) {
    return res.status(400).json({
      error: "La contraseña es demasiado débil. Elige una más segura.",
    });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const updatePasswordQuery =
    "UPDATE users SET password = ? WHERE BINARY idusers = ?";

  db.query(updatePasswordQuery, [hashedPassword, idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo actualizar la contraseña. Inténtalo nuevamente.",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({
        error: "No se encontró el usuario para actualizar la contraseña.",
      });
    }

    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente." });
  });
};

module.exports = changePassword;
