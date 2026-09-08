const db = require("../../db/db");

const deleteCategory = async (req, res) => {
  const { categoryName } = req.params;

  if (!categoryName) {
    return res.status(400).json({
      error: "Falta el nombre de la categoría para continuar.",
    });
  }

  const checkQuery = "SELECT * FROM categories WHERE category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo consultar la información de la categoría.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        message: "La categoría no existe o ya fue eliminada.",
      });
    }

    const deleteProducts = "DELETE FROM products WHERE idcategoria = ?";
    const deleteCategory = "DELETE FROM categories WHERE idcategoria = ?";
    const categoryInfo = results[0];

    db.query(deleteProducts, [categoryInfo.idcategoria], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudieron eliminar los productos relacionados.",
        });
      }

      db.query(deleteCategory, [categoryInfo.idcategoria], (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo eliminar la categoría.",
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
