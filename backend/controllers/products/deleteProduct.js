const db = require("../../db/db");

const deleteProduct = (req, res) => {
  const { product_name } = req.body;

  if (!product_name) {
    return res.status(400).json({ error: "falta el nombre del producto" });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "el producto no existe" });
    }

    const deleteQuery = "DELETE FROM products WHERE product_name = ?";

    db.query(deleteQuery, [product_name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "error al eliminar el producto" });
      }

      return res
        .status(200)
        .json({ message: "producto eliminado correctamente" });
    });
  });
};

module.exports = deleteProduct;
