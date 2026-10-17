const db = require("../../db/db");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const idusers = req.user.idusers;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      error: "Complete todos los campos obligatorios.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: "Las contraseñas no coinciden.",
    });
  }

  const passwordStrength = zxcvbn(newPassword);

  if (passwordStrength.score < 3) {
    return res.status(400).json({
      error: "La contraseña no cumple los requisitos de seguridad.",
    });
  }

  const accountQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(accountQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar la cuenta. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "La cuenta no existe o ya fue eliminada.",
      });
    }

    const currentPasswordMatch = bcrypt.compareSync(
      currentPassword,
      results[0].password,
    );

    if (!currentPasswordMatch) {
      return res.status(400).json({
        error: "La contraseña actual es incorrecta.",
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updatePasswordQuery =
      "UPDATE users SET password = ? WHERE BINARY idusers = ?";

    db.query(updatePasswordQuery, [hashedPassword, idusers], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo actualizar la contraseña. Inténtelo de nuevo.",
        });
      }

      return res
        .status(200)
        .json({ message: "Contraseña actualizada correctamente." });
    });
  });
};

module.exports = changePassword;
