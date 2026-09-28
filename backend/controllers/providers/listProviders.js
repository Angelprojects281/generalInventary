const db = require("../../db/db");

const listProviders = (req, res) => {
  const listQuery = "SELECT * FROM providers";

  db.query(listQuery, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los proveedores. Inténtalo nuevamente.",
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = listProviders;
