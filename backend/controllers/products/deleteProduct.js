const db = require("../../db/db");

const deleteProduct = (req, res) => {
  const { product_name } = req.params;
  const idusers = req.user.idusers;

  if (!product_name) {
    return res.status(400).json({
      error: "El nombre del producto es obligatorio.",
    });
  }

  const checkProduct =
    "SELECT * FROM products WHERE BINARY idusers = ? AND product_name = ?";

  db.query(checkProduct, [idusers, product_name], (err, results) => {
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

    const deleteQuery =
      "DELETE FROM products WHERE BINARY idusers = ? AND product_name = ?";

    db.query(deleteQuery, [idusers, product_name], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo eliminar el producto. Inténtelo de nuevo.",
        });
      }

      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente." });
    });
  });
};

module.exports = deleteProduct;
