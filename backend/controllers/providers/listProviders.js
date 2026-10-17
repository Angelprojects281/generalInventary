const db = require("../../db/db");

const listProviders = (req, res) => {
  // La centinela global "SIN PROVEEDOR" tiene idusers NULL, por lo que
  // al filtrar por empresa nunca aparece en la lista.
  const listQuery =
    "SELECT * FROM providers WHERE BINARY idusers = ? ORDER BY provider_name";

  db.query(listQuery, [req.user.idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los proveedores. Inténtelo de nuevo.",
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = listProviders;
