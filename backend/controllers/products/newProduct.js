const db = require("../../db/db");

const newProduct = (req, res) => {
  const { product_name, amount, description, categoryName, provider } =
    req.body;

  if (!product_name || !categoryName || !provider) {
    return res.status(400).json({
      error:
        "Falta el nombre del producto o la categoría. Completa los datos obligatorios.",
    });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el producto. Inténtalo nuevamente.",
        details: err.message,
      });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese nombre." });
    }

    db.query(checkCategory, [categoryName], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo verificar la categoría seleccionada.",
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          error: "La categoría seleccionada no existe.",
        });
      }

      const category = results[0];
      const idCategory = category.idcategoria;
      const columns = ["product_name", "idcategoria", "idprovider"];
      const valuesToInsert = [product_name, idCategory, provider];

      if (amount !== undefined && amount !== null && amount !== "") {
        columns.splice(1, 0, "amount");
        valuesToInsert.splice(1, 0, amount);
      }

      if (
        description !== undefined &&
        description !== null &&
        description !== ""
      ) {
        columns.splice(columns.length - 2, 0, "description");
        valuesToInsert.splice(valuesToInsert.length - 2, 0, description);
      }

      const placeholders = columns.map(() => "?").join(", ");
      const query = `INSERT INTO products (${columns.join(", ")}) VALUES (${placeholders})`;

      db.query(query, valuesToInsert, (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo guardar el producto. Inténtalo nuevamente.",
            details: err.message,
          });
        }

        return res
          .status(200)
          .json({ message: "Producto creado correctamente." });
      });
    });
  });
};

module.exports = newProduct;
