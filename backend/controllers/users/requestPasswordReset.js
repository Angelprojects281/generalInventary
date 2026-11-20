const db = require("../../db/db");
const codeStore = require("../../services/codeStore");

// Respuesta siempre generica (anti-enumeracion): el mismo texto sirve
// aunque el correo no exista. Solo se envia el codigo si hay cuenta con
// ese correo y no hay cooldown de 60 segundos. Funciona tambien en
// cuentas sin verificar: el correo demuestra la posesion.
const requestPasswordReset = (req, res) => {
  const { email } = req.body;

  res.status(200).json({
    message:
      "Si existe una cuenta con ese correo, recibirás un código para restablecer tu contraseña.",
  });

  if (!email) {
    return;
  }

  const accountQuery = "SELECT * FROM users WHERE email = ?";

  db.query(accountQuery, [email], (err, results) => {
    if (err) {
      console.error("No se pudo buscar la cuenta:", err);
      return;
    }

    if (results.length === 0) {
      return;
    }

    codeStore.emitirCodigo(
      results[0].idusers,
      "recuperacion",
      email,
      (err) => {
        if (err) {
          console.error(
            "No se pudo enviar el correo de recuperacion:",
            err,
          );
        }
      },
    );
  });
};

module.exports = requestPasswordReset;
