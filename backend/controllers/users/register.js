const db = require("../../db/db");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const codeStore = require("../../services/codeStore");

const register = (req, res) => {
  const { idusers, companyName, email, password } = req.body;

  if (!idusers || !companyName || !email || !password) {
    return res.status(400).json({
      error: "Complete todos los campos obligatorios.",
    });
  }

  if (idusers.length > 50) {
    return res.status(400).json({
      error: "El usuario no puede superar los 50 caracteres.",
    });
  }

  if (companyName.length > 100) {
    return res.status(400).json({
      error: "El nombre de la empresa no puede superar los 100 caracteres.",
    });
  }

  // Regex simple: algo antes de la @, algo despues y un punto en el
  // dominio. El limite de 255 encaja con la columna email.
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: "Ingrese un correo electrónico válido.",
    });
  }

  const passwordStrength = zxcvbn(password);

  if (passwordStrength.score < 3) {
    return res.status(400).json({
      error: "La contraseña no cumple los requisitos de seguridad.",
    });
  }

  const verifyUserQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(verifyUserQuery, [idusers], (err, results) => {
    if (err) {
      console.error("No se pudo verificar el usuario:", err);
      return res.status(500).json({
        error: "No se pudo verificar si la cuenta ya existe.",
      });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe una cuenta con ese usuario." });
    }

    // El correo se consulta SIN BINARY: la colacion de la columna hace
    // la unicidad sin distincion de mayusculas, correcta para correos.
    const verifyEmailQuery = "SELECT * FROM users WHERE email = ?";

    db.query(verifyEmailQuery, [email], (err, results) => {
      if (err) {
        console.error("No se pudo verificar el correo:", err);
        return res.status(500).json({
          error: "No se pudo verificar si la cuenta ya existe.",
        });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Ya existe una cuenta con ese correo." });
      }

      const encryptedPassword = bcrypt.hashSync(password, 10);

      const insertUserQuery =
        "INSERT INTO users (idusers, company_name, email, password, email_verified) " +
        "VALUES (?, ?, ?, ?, 0)";

      db.query(
        insertUserQuery,
        [idusers, companyName, email, encryptedPassword],
        (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              if (err.message.includes("users_email")) {
                return res
                  .status(400)
                  .json({ error: "Ya existe una cuenta con ese correo." });
              }

              return res
                .status(400)
                .json({ error: "Ya existe una cuenta con ese usuario." });
            }

            console.error("No se pudo crear la cuenta:", err);
            return res.status(500).json({
              error: "No se pudo crear la cuenta. Inténtelo de nuevo.",
            });
          }

          // El codigo de verificacion se emite y se envia antes de
          // responder. Si el correo falla, la cuenta recien creada se
          // revierte (aun no tiene inventario) para que el usuario pueda
          // reintentar limpiamente.
          codeStore.emitirCodigo(
            idusers,
            "verificacion",
            email,
            (err, enviado) => {
              if (err) {
                console.error(
                  "No se pudo enviar el correo de verificacion:",
                  err,
                );

                db.query(
                  "DELETE FROM users WHERE BINARY idusers = ?",
                  [idusers],
                  (errBorrado) => {
                    if (errBorrado) {
                      console.error(
                        "No se pudo revertir la cuenta creada:",
                        errBorrado,
                      );
                    }
                  },
                );

                return res.status(500).json({
                  error:
                    "No se pudo enviar el correo de verificación. Inténtelo de nuevo.",
                });
              }

              // Sin token: la cuenta queda sin verificar hasta que el
              // usuario confirme el codigo (auto-login en /verifyAccount).
              return res.status(200).json({
                message:
                  "Cuenta creada correctamente. Hemos enviado un código de verificación a su correo.",
              });
            },
          );
        },
      );
    });
  });
};

module.exports = register;
