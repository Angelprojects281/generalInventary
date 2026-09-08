const db = require("../../db/db");
const { notify } = require("../../routes/routes");

const newMovement = (req, res) => {
  const { type, amount, category_name, product_name, userName } = req.body;
  const DATE = new Date();

  if (!type || !amount || !category_name || !product_name || !userName) {
    return res.status(400).json({
      error: "Faltan datos obligatorios para registrar el movimiento.",
    });
  }

  if (amount < 0) {
    return res.status(400).json({
      error: "La cantidad debe ser mayor a 0 para registrar el movimiento.",
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
        error: "El producto no existe en el inventario.",
      });
    }

    let actualAmount = results[0].amount;

    if (type === "entrada") {
      actualAmount += amount;
    } else if (type === "salida") {
      if (actualAmount < amount) {
        return res.status(400).json({
          error: "No hay suficiente stock para realizar esta salida.",
        });
      }

      actualAmount -= amount;
    }

    const updateQuery =
      "UPDATE products SET amount = ? WHERE product_name = ? ";

    db.query(updateQuery, [actualAmount, product_name], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo actualizar el inventario.",
        });
      }

      const regMovement =
        "INSERT INTO movements (movement_type, date_movement, amount, category, product_name, idusers) VALUES (?, ?, ?, ?, ?, ?)";

      db.query(
        regMovement,
        [type, DATE, amount, category_name, product_name, userName],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              error: "No se pudo registrar el movimiento.",
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
