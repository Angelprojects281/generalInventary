const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { categoryName, amount } = req.query;

  let principalQuery = `
    SELECT 
      products.idproducts,
      products.product_name,
      products.amount,
      products.description,
      categories.category AS category
    FROM products
    INNER JOIN categories 
      ON products.idcategoria = categories.idcategoria
    WHERE 1=1
  `;
  const values = [];

  if (categoryName) {
    principalQuery += " AND categories.category = ?";
    values.push(categoryName);
  }

  if (amount) {
    principalQuery += " AND amount <= ?";
    values.push(amount);
  }

  db.query(principalQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los productos. Inténtalo nuevamente.",
      });
    }

    return res.status(200).json(results);
  });
};
module.exports = filterProducts;
