const db = require("../../db/db");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");

const newUser = (req, res) => {
  const { idusers, password, rol } = req.body;

  if (!idusers || !password || !rol) {
    return res.status(400).json({ message: "Error, faltan campos necesarios" });
  }

  const passwordStrength = zxcvbn(password);

  if (passwordStrength.score < 3) {
    return res
      .status(400)
      .json({ message: "Error, la contraseña es demasiado débil" });
  }

  const verifyUserQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(verifyUserQuery, [idusers], (err, results) => {
    if (err) {
      console.error("Error al verificar el usuario:", err);
      return res.status(500).json({ message: "Error al verificar el usuario" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Error, el usuario ya existe" });
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const insertUserQuery =
      "INSERT INTO users (idusers, password, rol) VALUES (?, ?, ?)";

    db.query(
      insertUserQuery,
      [idusers, encryptedPassword, rol],
      (err, results) => {
        if (err) {
          console.error("Error al insertar el usuario:", err);
          return res
            .status(500)
            .json({ message: "Error al insertar el usuario" });
        }

        return res.status(200).json({ message: "Usuario creado exitosamente" });
      },
    );
  });
};

module.exports = newUser;
