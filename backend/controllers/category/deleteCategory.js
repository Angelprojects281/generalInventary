const db = require("../../db/db");

const deleteCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res
      .status(400)
      .json({ error: "Error, falta el nombre de la categoria" });
  }

  const checkQuery = "SELECT * FROM categories WHERE category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "La categoria no existe" });
    }

    const deleteProducts = "DELETE FROM products WHERE idcategoria = ?";
    const deleteCategory = "DELETE FROM categories WHERE idcategoria = ?";
    const categoryInfo = results[0];

    db.query(deleteProducts, [categoryInfo.idcategoria], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al eliminar los productos relacionados" });
      }

      db.query(deleteCategory, [categoryInfo.idcategoria], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al eliminar la categoria" });
        }

        return res.status(200).json({
          message:
            "Se elimino la categoria y los productos relacionados correctamente.",
        });
      });
    });
  });
};

module.exports = deleteCategory;
