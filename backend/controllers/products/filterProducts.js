const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { categoryName, amount } = req.body;

  if (!categoryName && !amount) {
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

  if (!categoryName) {
    const filterStock = "SELECT * FROM products WHERE amount <= ?";

    return db.query(filterStock, [amount], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error al consultar la base de datos" });
      }

      return res.status(200).json(results);
    });
  }

  if (!amount) {
    const checkCategory = "SELECT * FROM categories WHERE category = ?";

    return db.query(checkCategory, [categoryName], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error al consultar la base de datos" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "la categoria no existe" });
      }

      const filterCategory = results[0];

      const filterProductsQuery =
        "SELECT * FROM products WHERE idcategoria = ?";

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
  }

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  return db.query(checkCategory, [categoryName], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "la categoria no existe" });
    }

    const filterCategory = results[0];
    const filterProductsAmount =
      "SELECT * FROM products WHERE idcategoria = ? AND amount <= ?";

    db.query(
      filterProductsAmount,
      [filterCategory.idcategoria, amount],
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
