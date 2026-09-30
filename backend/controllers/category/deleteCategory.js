const db = require("../../db/db");

const deleteCategory = async (req, res) => {
  const { categoryName } = req.params;

  if (!categoryName) {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio.",
    });
  }

  const checkQuery = "SELECT * FROM categories WHERE category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
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

    const deleteProducts = "DELETE FROM products WHERE idcategoria = ?";
    const deleteCategory = "DELETE FROM categories WHERE idcategoria = ?";
    const categoryInfo = results[0];

    db.query(deleteProducts, [categoryInfo.idcategoria], (err, results) => {
      if (err) {
        return res.status(500).json({
          error:
            "No se pudieron eliminar los productos asociados. Inténtelo de nuevo.",
        });
      }

      db.query(deleteCategory, [categoryInfo.idcategoria], (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo eliminar la categoría. Inténtelo de nuevo.",
          });
        }

        return res.status(200).json({
          message:
            "La categoría y sus productos relacionados se eliminaron correctamente.",
        });
      });
    });
  });
};

module.exports = deleteCategory;
