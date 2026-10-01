const db = require("../../db/db");
const { notify } = require("../../routes/routes");

const newMovement = (req, res) => {
  const { type, amount, category_name, product_name, userName } = req.body;
  const DATE = new Date();

  if (!type || !amount || !category_name || !product_name || !userName) {
    return res.status(400).json({
      error: "Complete los datos obligatorios del movimiento.",
    });
  }

  if (amount < 0) {
    return res.status(400).json({
      error: "Ingrese una cantidad mayor que cero.",
    });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar el producto. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El producto no existe en el inventario.",
      });
    }

    const product = results[0];
    let actualAmount = product.amount;

    if (type === "entrada") {
      actualAmount += amount;
    } else if (type === "salida") {
      if (actualAmount < amount) {
        return res.status(400).json({
          error: "No hay existencias suficientes para registrar la salida.",
        });
      }

      actualAmount -= amount;
    }

    const updateQuery =
      "UPDATE products SET amount = ? WHERE product_name = ? ";

    db.query(updateQuery, [actualAmount, product_name], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo actualizar el inventario. Inténtelo de nuevo.",
        });
      }

      const regMovement =
        "INSERT INTO movements (movement_type, date_movement, amount, category, product_name, product_code, idusers) VALUES (?, ?, ?, ?, ?, ?, ?)";

      db.query(
        regMovement,
        [
          type,
          DATE,
          amount,
          category_name,
          product_name,
          product.product_code,
          userName,
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "No se pudo registrar el movimiento. Inténtelo de nuevo.",
            });
          }

          return res
            .status(200)
            .json({ message: "Movimiento registrado correctamente." });
        },
      );
    });
  });
};

module.exports = newMovement;
