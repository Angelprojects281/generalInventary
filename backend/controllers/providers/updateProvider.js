const db = require("../../db/db");

const updateProvider = (req, res) => {
  const { idprovider, provider_name, contact } = req.body;
  const idusers = req.user.idusers;

  if (!idprovider || !provider_name || !contact) {
    return res.status(400).json({
      error: "El nombre y el número de contacto son obligatorios.",
    });
  }

  if (Number(idprovider) === 0) {
    return res.status(400).json({
      error: "No se puede editar el proveedor predeterminado.",
    });
  }

  const parsedContact = Number(contact);

  if (!Number.isInteger(parsedContact) || parsedContact <= 0) {
    return res.status(400).json({
      error: "Ingrese un nombre y un número de contacto válido.",
    });
  }

  const checkProviderQuery =
    "SELECT * FROM providers WHERE BINARY idusers = ? AND idprovider = ?";

  db.query(checkProviderQuery, [idusers, idprovider], (err, results) => {
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

    const checkNameQuery =
      "SELECT * FROM providers WHERE BINARY idusers = ? AND provider_name = ? AND idprovider != ?";

    db.query(
      checkNameQuery,
      [idusers, provider_name, idprovider],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo verificar el proveedor. Inténtelo de nuevo.",
          });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Ya existe un proveedor con ese nombre." });
        }

        const updateQuery =
          "UPDATE providers SET provider_name = ?, contact = ? WHERE BINARY idusers = ? AND idprovider = ?";

        db.query(
          updateQuery,
          [provider_name, parsedContact, idusers, idprovider],
          (err) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return res
                  .status(400)
                  .json({ error: "Ya existe un proveedor con ese nombre." });
              }

              return res.status(500).json({
                error: "No se pudo actualizar el proveedor. Inténtelo de nuevo.",
              });
            }

            return res
              .status(200)
              .json({ message: "Proveedor actualizado correctamente." });
          },
        );
      },
    );
  });
};

module.exports = updateProvider;
