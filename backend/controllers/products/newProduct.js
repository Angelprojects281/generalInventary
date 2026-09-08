const db = require("../../db/db");

const newProduct = (req, res) => {
  const { product_name, amount, description, categoryName } = req.body;
  const newProductQuery =
    "INSERT INTO products (product_name, amount, description, idcategoria) VALUES (?, ?, ?, ?)";

  if (!product_name || !categoryName) {
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

      if (!amount && !description) {
        const query =
          "INSERT INTO products (product_name, idcategoria) VALUES (?, ?)";

        return db.query(query, [product_name, idCategory], (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "No se pudo guardar el producto. Inténtalo nuevamente.",
              details: err.message,
            });
          }

          return res.status(200).json({
            message: "Producto creado correctamente.",
          });
        });
      }

      if (!description) {
        const query =
          "INSERT INTO products (product_name, amount, idcategoria) VALUES (?, ?, ?)";

        return db.query(
          query,
          [product_name, amount, idCategory],
          (err, results) => {
            if (err) {
              return res.status(500).json({
                error: "No se pudo guardar el producto. Inténtalo nuevamente.",
                details: err.message,
              });
            }

            return res.status(200).json({
              message: "Producto creado correctamente.",
            });
          },
        );
      }

      if (!amount) {
        const query =
          "INSERT INTO products (product_name, description, idcategoria) VALUES (?, ?, ?)";

        return db.query(
          query,
          [product_name, description, idCategory],
          (err, results) => {
            if (err) {
              return res.status(500).json({
                error: "No se pudo guardar el producto. Inténtalo nuevamente.",
                details: err.message,
              });
            }

            return res.status(200).json({
              message: "Producto creado correctamente.",
            });
          },
        );
      }

      db.query(
        newProductQuery,
        [product_name, amount, description, idCategory],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "No se pudo guardar el producto. Inténtalo nuevamente.",
              details: err.message,
            });
          }

          return res
            .status(200)
            .json({ message: "Producto creado correctamente." });
        },
      );
    });
  });
};

module.exports = newProduct;
