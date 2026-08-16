const db = require("../../db/db");

const newProduct = (req, res) => {
  const { product_name, amount, description, categoryName } = req.body;
  const newProductQuery =
    "INSERT INTO products (product_name, amount, description, idcategoria) VALUES (?, ?, ?, ?)";

  if (!product_name || !categoryName) {
    return res
      .status(400)
      .json({ error: "se debe ingresar el nombre y categoria del producto" });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  const checkCategory = "SELECT * FROM categories WHERE category = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "error al insertar el nuevo producto",
        details: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "este producto ya existe" });
    }

    db.query(checkCategory, [categoryName], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "no se puedo consultar la categoria" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "la categoria no existe" });
      }

      const category = results[0];
      const idCategory = category.idcategoria;

      if (!amount && !description) {
        const query =
          "INSERT INTO products (product_name, idcategoria) VALUES (?, ?)";

        return db.query(query, [product_name, idCategory], (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "error al insertar el producto",
              details: err.message,
            });
          }

          return res.status(200).json({
            message: "producto creado correctamente",
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
                error: "error al insertar el nuevo producto",
                details: err.message,
              });
            }

            return res.status(200).json({
              message: "producto creado correctamente",
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
                error: "error al insertar el nuevo producto",
                details: err.message,
              });
            }

            return res.status(200).json({
              message: "producto creado correctamente",
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
              error: "error al insertar el nuevo producto",
              details: err.message,
            });
          }

          return res
            .status(200)
            .json({ message: "prodcuto creado correctamente" });
        },
      );
    });
  });
};

module.exports = newProduct;
