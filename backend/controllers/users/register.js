const db = require("../../db/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zxcvbn = require("zxcvbn");

require("dotenv").config({
  path: __dirname + "/../../secretKey.env",
});

const register = (req, res) => {
  const { idusers, companyName, password } = req.body;

  if (!idusers || !companyName || !password) {
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

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const insertUserQuery =
      "INSERT INTO users (idusers, company_name, password) VALUES (?, ?, ?)";

    db.query(
      insertUserQuery,
      [idusers, companyName, encryptedPassword],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Ya existe una cuenta con ese usuario." });
          }

          console.error("No se pudo crear la cuenta:", err);
          return res.status(500).json({
            error: "No se pudo crear la cuenta. Inténtelo de nuevo.",
          });
        }

        const token = jwt.sign({ idusers }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          message: "Cuenta creada correctamente.",
          token,
          companyName,
        });
      },
    );
  });
};

module.exports = register;
