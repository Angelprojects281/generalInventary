const db = require("../../db/db");

const newProduct = (req, res) => {
  const {
    product_code,
    product_name,
    amount,
    description,
    categoryName,
    provider_name,
  } = req.body;
  const productCode =
    typeof product_code === "string" ? product_code.trim() : "";

  if (!productCode || !product_name || !categoryName || !provider_name) {
    return res.status(400).json({
      error:
        "Ingrese el código único, el nombre del producto, la categoría y el proveedor.",
    });
  }

  if (productCode.length > 50) {
    return res.status(400).json({
      error: "El código único no puede superar los 50 caracteres.",
    });
  }

  const checkProductCode =
    "SELECT idproducts FROM products WHERE product_code = ?";
  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  const checkProvider = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkProductCode, [productCode], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el código único. Inténtelo de nuevo.",
      });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese código único." });
    }

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
          const columns = [
            "product_code",
            "product_name",
            "idcategoria",
            "idprovider",
          ];
          const valuesToInsert = [
            productCode,
            product_name,
            idCategory,
            provider.idprovider,
          ];

          if (amount !== undefined && amount !== null && amount !== "") {
            columns.splice(2, 0, "amount");
            valuesToInsert.splice(2, 0, amount);
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
              if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                  error: "Ya existe un producto con ese código único.",
                });
              }

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
  });
};

module.exports = newProduct;
