const db = require("../../db/db");
const { notify } = require("../../routes/routes");

const newMovement = (req, res) => {
  const { type, amount, category_name, product_name, userName } = req.body;
  const DATE = new Date();

  if (!type || !amount || !category_name || !product_name || !userName) {
    return res.status(400).json({ error: "faltan campos requeridos" });
  }

  if (amount < 0) {
    return res.status(400).json({ error: "amount debe ser mayor a cero" });
  }

  const checkProduct = "SELECT * FROM products WHERE product_name = ?";

  db.query(checkProduct, [product_name], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "El producto no existe",
      });
    }

    let actualAmount = results[0].amount;

    if (type === "entrada") {
      actualAmount += amount;
    } else if (type === "salida") {
      if (actualAmount < amount) {
        return res.status(400).json({
          error: "no hay suficiente stock para realizar este movimiento",
        });
      }

      actualAmount -= amount;
    }

    const updateQuery =
      "UPDATE products SET amount = ? WHERE product_name = ? ";

    db.query(updateQuery, [actualAmount, product_name], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error al actualizar la base de datos" });
      }

      const regMovement =
        "INSERT INTO movements (movement_type, date_movement, amount, category, product_name, idusers) VALUES (?, ?, ?, ?, ?, ?)";

      db.query(
        regMovement,
        [type, DATE, amount, category_name, product_name, userName],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "error al consultar la base de datos" });
          }

          return res
            .status(200)
            .json({ message: "movimiento creado correctamente" });
        },
      );
    });
  });
};

module.exports = newMovement;
