const db = require("../../db/db");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");

const changePassword = async (req, res) => {
  const { idusers, newPassword, confirmPassword } = req.body;

  if (!idusers || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Error, faltan campos necesarios" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Error, las contraseñas no coinciden" });
  }

  const passwordStrength = zxcvbn(newPassword);

  if (passwordStrength.score < 3) {
    return res.status(400).json({
      message:
        "Error, la contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.",
    });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const updatePasswordQuery =
    "UPDATE users SET password = ? WHERE BINARY idusers = ?";

  db.query(updatePasswordQuery, [hashedPassword, idusers], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar la contraseña" });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: "Error, el usuario no existe" });
    }

    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente" });
  });
};

module.exports = changePassword;
