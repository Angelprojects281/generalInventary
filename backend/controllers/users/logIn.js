const db = require("../../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: __dirname + "/../../secretKey.env",
});

const logIn = async (req, res) => {
  const { idusers, password } = req.body;

  if (!idusers || !password) {
    return res.status(400).json({
      error: "Ingrese su usuario y contraseña.",
    });
  }

  const verifyUserQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(verifyUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo iniciar sesión. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El usuario o la contraseña son incorrectos.",
      });
    }

    const user = results[0];

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        error: "El usuario o la contraseña son incorrectos.",
      });
    }

    // Cuenta sin verificar: no se emite token. El frontend detecta el
    // 403 (apiFetch solo intercepta el 401) y abre la pantalla de
    // verificacion.
    if (user.email_verified === 0) {
      return res.status(403).json({
        error:
          "Su cuenta no está verificada. Revise su correo para introducir el código.",
      });
    }

    const token = jwt.sign({ idusers: user.idusers }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      companyName: user.company_name,
    });
  });
};

module.exports = logIn;
