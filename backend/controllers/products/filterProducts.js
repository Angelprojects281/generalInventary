const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { product_code, categoryName, amount, provider_name } = req.query;
  const idusers = req.user.idusers;

  let principalQuery = `
    SELECT
      products.idproducts,
      products.idusers,
      products.product_code,
      products.product_name,
      products.amount,
      products.description,
      categories.category AS category,
      providers.provider_name AS provider_name
    FROM products
    INNER JOIN categories
      ON products.idcategoria = categories.idcategoria
      AND categories.idusers = products.idusers
    LEFT JOIN providers
      ON products.idprovider = providers.idprovider
    WHERE BINARY products.idusers = ?
  `;
  const values = [idusers];

  if (product_code) {
    principalQuery += " AND products.product_code = ?";
    values.push(product_code);
  }

  if (categoryName) {
    principalQuery += " AND categories.category = ?";
    values.push(categoryName);
  }

  if (amount) {
    principalQuery += " AND products.amount <= ?";
    values.push(amount);
  }

  if (provider_name) {
    principalQuery += " AND providers.provider_name = ?";
    values.push(provider_name);
  }

  db.query(principalQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los productos. Inténtelo de nuevo.",
      });
    }

    return res.status(200).json(results);
  });
};
module.exports = filterProducts;
