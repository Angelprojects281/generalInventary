const db = require("../../db/db");

const deleteProduct = (req, res) => {
  const { product_name } = req.params;

  if (!product_name) {
    return res.status(400).json({
      error: "Falta el nombre del producto para continuar.",
    });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el producto en este momento.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El producto no existe o ya fue eliminado.",
      });
    }

    const deleteQuery = "DELETE FROM products WHERE product_name = ?";

    db.query(deleteQuery, [product_name], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo eliminar el producto. Inténtalo nuevamente.",
        });
      }

      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente." });
    });
  });
};

module.exports = deleteProduct;
