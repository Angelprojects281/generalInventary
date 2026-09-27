const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { categoryName, amount, provider } = req.query;

  let principalQuery = `
    SELECT 
      products.idproducts,
      products.product_name,
      products.amount,
      products.description,
      categories.category AS category,
      providers.provider_name AS provider_name
    FROM products
    INNER JOIN categories 
      ON products.idcategoria = categories.idcategoria
    LEFT JOIN providers
      ON products.idprovider = providers.idprovider
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

  if (provider) {
    principalQuery += " AND providers.provider_name = ?";
    values.push(provider);
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
