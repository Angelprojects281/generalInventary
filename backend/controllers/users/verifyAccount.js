const db = require("../../db/db");
const jwt = require("jsonwebtoken");
const codeStore = require("../../services/codeStore");

require("dotenv").config({
  path: __dirname + "/../../secretKey.env",
});

const verifyAccount = (req, res) => {
  const { idusers, code } = req.body;

  if (!idusers) {
    return res.status(400).json({
      error: "Complete todos los campos obligatorios.",
    });
  }

  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return res.status(400).json({
      error: "El código debe tener 6 dígitos.",
    });
  }

  codeStore.validarCodigo(idusers, "verificacion", code, (err, estado) => {
    if (err) {
      console.error("No se pudo validar el codigo:", err);
      return res.status(500).json({
        error: "No se pudo verificar el código. Inténtelo de nuevo.",
      });
    }

    if (estado === "sin_codigo") {
      return res.status(400).json({
        error: "No hay ningún código pendiente para esa cuenta.",
      });
    }

    if (estado === "caducado") {
      return res.status(400).json({
        error: "El código ha caducado. Solicite uno nuevo.",
      });
    }

    if (estado === "demasiados") {
      return res.status(400).json({
        error: "Demasiados intentos. Solicite un nuevo código.",
      });
    }

    if (estado === "incorrecto") {
      return res.status(400).json({
        error: "El código es incorrecto.",
      });
    }

    // Codigo correcto: la fila ya se borro en validarCodigo (un solo
    // uso); se marca la cuenta como verificada y se firma el token para
    // el auto-login.
    const verificarQuery =
      "UPDATE users SET email_verified = 1 WHERE BINARY idusers = ?";

    db.query(verificarQuery, [idusers], (err) => {
      if (err) {
        console.error("No se pudo marcar la cuenta como verificada:", err);
        return res.status(500).json({
          error: "No se pudo verificar la cuenta. Inténtelo de nuevo.",
        });
      }

      const accountQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

      db.query(accountQuery, [idusers], (err, results) => {
        if (err || results.length === 0) {
          if (err) {
            console.error("No se pudo leer la cuenta verificada:", err);
          }
          return res.status(500).json({
            error: "No se pudo verificar la cuenta. Inténtelo de nuevo.",
          });
        }

        const user = results[0];

        const token = jwt.sign(
          { idusers: user.idusers },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        return res.status(200).json({
          message: "Cuenta verificada correctamente.",
          token,
          companyName: user.company_name,
        });
      });
    });
  });
};

module.exports = verifyAccount;
