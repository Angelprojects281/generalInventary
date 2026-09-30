const db = require("../../db/db");

const newProvider = async (req, res) => {
  const { provider_name, contact } = req.body;

  if (!provider_name || !contact) {
    return res.status(400).json({
      error: "El nombre y el número de contacto son obligatorios.",
    });
  }

  const checkQuery = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkQuery, [provider_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el proveedor. Inténtelo de nuevo.",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya existe un proveedor con ese nombre.",
      });
    }

    const query =
      "INSERT INTO providers (provider_name, contact) VALUES (?, ?)";

    db.query(query, [provider_name, contact], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo crear el proveedor. Inténtelo de nuevo.",
        });
      }

      return res
        .status(200)
        .json({ message: "Proveedor creado correctamente." });
    });
  });
};

module.exports = newProvider;
