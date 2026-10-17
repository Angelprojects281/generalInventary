const db = require("../../db/db");
const jwt = require("jsonwebtoken");

require("dotenv").config({
  path: __dirname + "/../../secretKey.env",
});

const updateAccount = (req, res) => {
  const { newIdusers, companyName } = req.body;
  const currentIdusers = req.user.idusers;

  if (!newIdusers && !companyName) {
    return res.status(400).json({
      error: "Ingrese el nuevo usuario o el nombre de la empresa.",
    });
  }

  if (newIdusers && newIdusers.length > 50) {
    return res.status(400).json({
      error: "El usuario no puede superar los 50 caracteres.",
    });
  }

  if (companyName && companyName.length > 100) {
    return res.status(400).json({
      error: "El nombre de la empresa no puede superar los 100 caracteres.",
    });
  }

  const checkUserQuery = "SELECT idusers FROM users WHERE BINARY idusers = ?";

  db.query(checkUserQuery, [currentIdusers], (err, results) => {
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

    // Cambiar solo el usuario, cambiar solo la empresa o ambos a la vez.
    const finalIdusers = newIdusers || currentIdusers;

    if (newIdusers && newIdusers !== currentIdusers) {
      db.query(checkUserQuery, [newIdusers], (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo verificar el usuario. Inténtelo de nuevo.",
          });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Ya existe una cuenta con ese usuario." });
        }

        applyUpdate(currentIdusers, finalIdusers, companyName, res);
      });

      return;
    }

    applyUpdate(currentIdusers, finalIdusers, companyName, res);
  });
};

const applyUpdate = (currentIdusers, finalIdusers, companyName, res) => {
  const setClauses = [];
  const values = [];

  if (finalIdusers !== currentIdusers) {
    setClauses.push("idusers = ?");
    values.push(finalIdusers);
  }

  if (companyName) {
    setClauses.push("company_name = ?");
    values.push(companyName);
  }

  if (setClauses.length === 0) {
    return signNewToken(finalIdusers, companyName, res);
  }

  values.push(currentIdusers);

  const updateQuery = `UPDATE users SET ${setClauses.join(", ")} WHERE BINARY idusers = ?`;

  db.query(updateQuery, values, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: "Ya existe una cuenta con ese usuario." });
      }

      return res.status(500).json({
        error: "No se pudo actualizar la cuenta. Inténtelo de nuevo.",
      });
    }

    return signNewToken(finalIdusers, companyName, res);
  });
};

// El token vigente conserva el usuario anterior, por lo que se emite
// uno nuevo con el usuario actualizado.
const signNewToken = (idusers, companyName, res) => {
  const token = jwt.sign({ idusers }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "Cuenta actualizada correctamente.",
    token,
    ...(companyName ? { companyName } : {}),
  });
};

module.exports = updateAccount;
