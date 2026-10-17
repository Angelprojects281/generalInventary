const db = require("../../db/db");

const updateCategory = (req, res) => {
  const { idcategoria, categoryName } = req.body;
  const idusers = req.user.idusers;

  if (!idcategoria || !categoryName) {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio.",
    });
  }

  if (categoryName.length > 50) {
    return res.status(400).json({
      error: "El nombre de la categoría no puede superar los 50 caracteres.",
    });
  }

  const checkCategoryQuery =
    "SELECT * FROM categories WHERE BINARY idusers = ? AND idcategoria = ?";

  db.query(checkCategoryQuery, [idusers, idcategoria], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo consultar la categoría. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "La categoría no existe o ya fue eliminada.",
      });
    }

    const checkNameQuery =
      "SELECT * FROM categories WHERE BINARY idusers = ? AND category = ? AND idcategoria != ?";

    db.query(
      checkNameQuery,
      [idusers, categoryName, idcategoria],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo verificar la categoría. Inténtelo de nuevo.",
          });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Ya existe una categoría con ese nombre." });
        }

        const updateQuery =
          "UPDATE categories SET category = ? WHERE BINARY idusers = ? AND idcategoria = ?";

        db.query(
          updateQuery,
          [categoryName, idusers, idcategoria],
          (err) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return res
                  .status(400)
                  .json({ error: "Ya existe una categoría con ese nombre." });
              }

              return res.status(500).json({
                error: "No se pudo actualizar la categoría. Inténtelo de nuevo.",
              });
            }

            return res
              .status(200)
              .json({ message: "Categoría actualizada correctamente." });
          },
        );
      },
    );
  });
};

module.exports = updateCategory;
