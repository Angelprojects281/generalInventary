const db = require("../../db/db");

const filterProducts = (req, res) => {
  const { product_code, product_name, categoryName, amount, provider_name } =
    req.query;
  const idusers = req.user.idusers;

  let principalQuery = `
    SELECT
      products.idproducts,
      products.idusers,
      products.product_code,
      products.product_name,
      products.amount,
      products.description,
      products.purchase_value,
      products.sale_value,
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

  if (product_name) {
    principalQuery += " AND products.product_name LIKE CONCAT('%', ?, '%')";
    values.push(product_name);
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

    // mysql2 devuelve DECIMAL como cadena; la API expone los valores
    // numericos para que la interfaz pueda operar con ellos.
    const products = results.map((row) => ({
      ...row,
      purchase_value: Number(row.purchase_value),
      sale_value: Number(row.sale_value),
    }));

    return res.status(200).json(products);
  });
};
module.exports = filterProducts;
