const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { categoryName, amount } = req.body;

  let principalQuery = "SELECT * FROM products WHERE 1=1";
  const values = [];

  if (categoryName) {
    const checkCategory = "SELECT * FROM categories WHERE category = ?";

    return db.query(checkCategory, [categoryName], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error al consultar la base de datos" });
      }

      if (results.length === 0) {
        return res.status(400).json({
          error: "la categoria no existe",
        });
      }

      const filterCategory = results[0];

      principalQuery += " AND idcategoria = ?";
      values.push(filterCategory.idcategoria);

      if (amount) {
        principalQuery += " AND amount <= ?";
        values.push(amount);
      }

      db.query(principalQuery, values, (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "error al consultar la base de datos" });
        }

        return res.status(200).json(results);
      });
    });
  }

  if (amount) {
    principalQuery += " AND amount <= ?";
    values.push(amount);
  }

  db.query(principalQuery, values, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    return res.status(200).json(results);
  });
};

module.exports = filterProducts;
