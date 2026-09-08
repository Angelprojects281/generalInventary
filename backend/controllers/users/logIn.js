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
      message: "Faltan datos obligatorios. Ingresa tu usuario y contraseña.",
    });
  }

  const verifyUserQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(verifyUserQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar tus datos. Inténtalo nuevamente.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "Usuario no encontrado. Verifica tus credenciales.",
      });
    }

    const user = results[0];

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        error: "La contraseña es incorrecta. Inténtalo nuevamente.",
      });
    }

    const token = jwt.sign(
      { idusers: user.idusers, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
    });
  });
};

module.exports = logIn;
