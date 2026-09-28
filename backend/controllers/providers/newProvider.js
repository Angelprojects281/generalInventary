const db = require("../../db/db");

const newProvider = async (req, res) => {
  const { provider_name, contact } = req.body;

  if (!provider_name || !contact) {
    return res.status(400).json({
      error:
        "Falta el nombre del proveedor o el numero de contacto. Ingresa los datos para continuar.",
    });
  }

  const checkQuery = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkQuery, [provider_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error:
          "No pudimos verificar el proveedor en este momento. Inténtalo nuevamente.",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "El proveedor ya existe. Ingresa otro nombre.",
      });
    }

    const query =
      "INSERT INTO providers (provider_name, contact) VALUES (?, ?)";

    db.query(query, [provider_name, contact], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo crear el proveedor. Inténtalo nuevamente.",
        });
      }

      return res
        .status(200)
        .json({ message: "Proveedor creado correctamente." });
    });
  });
};

module.exports = newProvider;
