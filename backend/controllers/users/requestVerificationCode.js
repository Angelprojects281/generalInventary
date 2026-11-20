const db = require("../../db/db");
const codeStore = require("../../services/codeStore");

// Respuesta siempre generica (anti-enumeracion): el mismo texto sirve
// aunque el usuario, el correo no coincidan o la cuenta ya este
// verificada. Solo se envia el codigo si la cuenta existe con ese
// correo, aun no esta verificada y no hay cooldown de 60 segundos.
const requestVerificationCode = (req, res) => {
  const { idusers, email } = req.body;

  res.status(200).json({
    message: "Si el usuario y el correo coinciden, recibirás un código de verificación.",
  });

  if (!idusers || !email) {
    return;
  }

  const accountQuery =
    "SELECT * FROM users WHERE BINARY idusers = ? AND email = ?";

  db.query(accountQuery, [idusers, email], (err, results) => {
    if (err) {
      console.error("No se pudo buscar la cuenta:", err);
      return;
    }

    if (results.length === 0 || results[0].email_verified !== 0) {
      return;
    }

    codeStore.emitirCodigo(
      idusers,
      "verificacion",
      results[0].email,
      (err) => {
        if (err) {
          console.error("No se pudo enviar el correo de verificacion:", err);
        }
      },
    );
  });
};

module.exports = requestVerificationCode;
