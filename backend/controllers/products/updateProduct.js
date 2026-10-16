const db = require("../../db/db");

const updateProduct = (req, res) => {
  const {
    idproducts,
    product_code,
    product_name,
    amount,
    description,
    categoryName,
    provider_name,
  } = req.body;
  const productCode =
    typeof product_code === "string" ? product_code.trim() : "";

  if (!idproducts || !productCode || !product_name || !categoryName || !provider_name) {
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

  const checkProduct =
    "SELECT idproducts FROM products WHERE idproducts = ?";
  const checkProductCode =
    "SELECT idproducts FROM products WHERE product_code = ? AND idproducts != ?";
  const checkProductName =
    "SELECT idproducts FROM products WHERE product_name = ? AND idproducts != ?";
  const checkCategory = "SELECT * FROM categories WHERE category = ?";
  const checkProvider = "SELECT * FROM providers WHERE provider_name = ?";

  db.query(checkProduct, [idproducts], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el producto. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El producto no existe o ya fue eliminado.",
      });
    }

    db.query(checkProductCode, [productCode, idproducts], (err, results) => {
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

      db.query(
        checkProductName,
        [product_name, idproducts],
        (err, results) => {
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

            db.query(checkProvider, [provider_name], (err, results) => {
              if (err) {
                return res.status(500).json({
                  error:
                    "No se pudo verificar el proveedor. Inténtelo de nuevo.",
                });
              }

              if (results.length === 0) {
                return res.status(400).json({
                  error: "El proveedor seleccionado no existe.",
                });
              }

              const provider = results[0];
              const setClauses = [
                "product_code = ?",
                "product_name = ?",
                "idcategoria = ?",
                "idprovider = ?",
              ];
              const valuesToUpdate = [
                productCode,
                product_name,
                category.idcategoria,
                provider.idprovider,
              ];

              if (amount !== undefined && amount !== null && amount !== "") {
                setClauses.push("amount = ?");
                valuesToUpdate.push(amount);
              }

              if (
                description !== undefined &&
                description !== null &&
                description !== ""
              ) {
                setClauses.push("description = ?");
                valuesToUpdate.push(description);
              }

              valuesToUpdate.push(idproducts);

              const query = `UPDATE products SET ${setClauses.join(", ")} WHERE idproducts = ?`;

              db.query(query, valuesToUpdate, (err) => {
                if (err) {
                  if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                      error: "Ya existe un producto con ese código único.",
                    });
                  }

                  return res.status(500).json({
                    error: "No se pudo actualizar el producto. Inténtelo de nuevo.",
                  });
                }

                return res
                  .status(200)
                  .json({ message: "Producto actualizado correctamente." });
              });
            });
          });
        },
      );
    });
  });
};

module.exports = updateProduct;
