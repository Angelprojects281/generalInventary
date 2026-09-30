const db = require("../../db/db");

const deleteProvider = async (req, res) => {
  const { provider_name } = req.params;

  if (!provider_name) {
    return res.status(400).json({
      error: "El nombre del proveedor es obligatorio.",
    });
  }

  const checkQuery = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkQuery, [provider_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo consultar el proveedor. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El proveedor no existe o ya fue eliminado.",
      });
    }

    const providerInfo = results[0];

    if (providerInfo.idprovider === 0) {
      return res.status(400).json({
        error: "No se puede eliminar el proveedor predeterminado.",
      });
    }

    const deleteProducts = "DELETE FROM products WHERE idprovider = ?";
    const deleteProviderQuery = "DELETE FROM providers WHERE idprovider = ?";

    db.query(deleteProducts, [providerInfo.idprovider], (err, results) => {
      if (err) {
        return res.status(500).json({
          error:
            "No se pudieron eliminar los productos asociados. Inténtelo de nuevo.",
        });
      }

      db.query(
        deleteProviderQuery,
        [providerInfo.idprovider],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "No se pudo eliminar el proveedor. Inténtelo de nuevo.",
            });
          }

          return res.status(200).json({
            message:
              "El proveedor y sus productos relacionados se eliminaron correctamente.",
          });
        },
      );
    });
  });
};

module.exports = deleteProvider;
