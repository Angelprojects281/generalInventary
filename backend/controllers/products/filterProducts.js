const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    const listAllProducts = "SELECT * FROM products";

    return db.query(listAllProducts, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error al consultar la base de datos" });
      }

      return res.status(200).json(results);
    });
  }

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  db.query(checkCategory, [categoryName], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "la categoria no existe" });
    }

    const filterCategory = results[0];

    const filterProductsQuery = "SELECT * FROM products WHERE idcategoria = ?";

    db.query(
      filterProductsQuery,
      [filterCategory.idcategoria],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "error al consultar la base de datos" });
        }

        return res.status(200).json(results);
      },
    );
  });
};

module.exports = filterProducts;
