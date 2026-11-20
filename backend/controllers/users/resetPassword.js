const db = require("../../db/db");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const codeStore = require("../../services/codeStore");

// Todo error de codigo (formato, caducidad o intentos) responde el mismo
// mensaje generico para no revelar si el correo existe. Tras el reset la
// contraseña se guarda con bcrypt (rounds 10) y email_verified no cambia:
// los propositos son independientes.
const resetPassword = (req, res) => {
  const { email, code, newPassword, confirmPassword } = req.body;

  if (!email || !code || !newPassword || !confirmPassword) {
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

  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return res.status(400).json({
      error: "El código es incorrecto o ha caducado.",
    });
  }

  const accountQuery = "SELECT * FROM users WHERE email = ?";

  db.query(accountQuery, [email], (err, results) => {
    if (err) {
      console.error("No se pudo buscar la cuenta:", err);
      return res.status(500).json({
        error: "No se pudo verificar el código. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El código es incorrecto o ha caducado.",
      });
    }

    const idusers = results[0].idusers;

    codeStore.validarCodigo(idusers, "recuperacion", code, (err, estado) => {
      if (err) {
        console.error("No se pudo validar el codigo:", err);
        return res.status(500).json({
          error: "No se pudo verificar el código. Inténtelo de nuevo.",
        });
      }

      if (estado !== "ok") {
        return res.status(400).json({
          error: "El código es incorrecto o ha caducado.",
        });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      const updatePasswordQuery =
        "UPDATE users SET password = ? WHERE BINARY idusers = ?";

      db.query(
        updatePasswordQuery,
        [hashedPassword, idusers],
        (err) => {
          if (err) {
            console.error("No se pudo actualizar la contraseña:", err);
            return res.status(500).json({
              error: "No se pudo actualizar la contraseña. Inténtelo de nuevo.",
            });
          }

          return res
            .status(200)
            .json({ message: "Contraseña actualizada correctamente." });
        },
      );
    });
  });
};

module.exports = resetPassword;
