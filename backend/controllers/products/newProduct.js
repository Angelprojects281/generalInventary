const db = require("../../db/db");

const newProduct = (req, res) => {
  const { product_name, amount, description, categoryName, provider_name } =
    req.body;

  if (!product_name || !categoryName || !provider_name) {
    return res.status(400).json({
      error: "Ingrese el nombre del producto, la categoría y el proveedor.",
    });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  const checkProvider = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el producto. Inténtelo de nuevo.",
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
          error: "No se pudo verificar la categoría. Inténtelo de nuevo.",
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          error: "La categoría seleccionada no existe.",
        });
      }

      const category = results[0];
      const idCategory = category.idcategoria;

      db.query(checkProvider, [provider_name], (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudo verificar el proveedor. Inténtelo de nuevo.",
          });
        }

        if (results.length === 0) {
          return res.status(400).json({
            error: "El proveedor seleccionado no existe.",
          });
        }

        const provider = results[0];
        const columns = ["product_name", "idcategoria", "idprovider"];
        const valuesToInsert = [product_name, idCategory, provider.idprovider];

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
              error: "No se pudo crear el producto. Inténtelo de nuevo.",
            });
          }

          return res
            .status(200)
            .json({ message: "Producto creado correctamente." });
        });
      });
    });
  });
};

module.exports = newProduct;
