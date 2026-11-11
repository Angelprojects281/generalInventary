const db = require("../../db/db");

const newMovement = async (req, res) => {
  const { type, items } = req.body;
  const idusers = req.user.idusers;

  if (type !== "entrada" && type !== "salida") {
    return res.status(400).json({
      error: "Complete los datos obligatorios del movimiento.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "Añade al menos un producto al movimiento.",
    });
  }

  // Fusionar las cantidades del mismo producto (decision: una sola
  // linea por producto) antes de validar identificadores y existencias.
  const quantities = new Map();

  for (const item of items) {
    if (!item || !Number.isInteger(item.idproducts)) {
      return res.status(400).json({
        error: "Producto no válido en el movimiento.",
      });
    }

    if (!Number.isInteger(item.amount) || item.amount < 1) {
      return res.status(400).json({
        error: "Ingrese una cantidad mayor que cero.",
      });
    }

    quantities.set(
      item.idproducts,
      (quantities.get(item.idproducts) || 0) + item.amount,
    );
  }

  const productIds = [...quantities.keys()];
  const idPlaceholders = productIds.map(() => "?").join(", ");

  const loadProducts = `
    SELECT
      products.idproducts,
      products.product_name,
      products.product_code,
      products.amount,
      products.purchase_value,
      products.sale_value,
      categories.category AS category
    FROM products
    INNER JOIN categories
      ON products.idcategoria = categories.idcategoria
      AND categories.idusers = products.idusers
    WHERE BINARY products.idusers = ?
      AND products.idproducts IN (${idPlaceholders})
  `;

  let products;

  try {
    const [results] = await db
      .promise()
      .query(loadProducts, [idusers, ...productIds]);

    if (results.length !== productIds.length) {
      return res.status(400).json({
        error: "El producto no existe en el inventario.",
      });
    }

    products = results;
  } catch (err) {
    return res.status(500).json({
      error: "No se pudo verificar el producto. Inténtelo de nuevo.",
    });
  }

  if (type === "salida") {
    for (const product of products) {
      if (quantities.get(product.idproducts) > product.amount) {
        return res.status(400).json({
          error: "No hay existencias suficientes para registrar la salida.",
        });
      }
    }
  }

  let connection;
  let failureMessage = "No se pudo registrar el movimiento. Inténtelo de nuevo.";

  try {
    connection = await db.promise().getConnection();

    await connection.query("BEGIN");

    // 1. Actualizar el stock de cada producto dentro de la transaccion.
    failureMessage = "No se pudo actualizar el inventario. Inténtelo de nuevo.";

    for (const product of products) {
      const quantity = quantities.get(product.idproducts);
      const operator = type === "entrada" ? "+" : "-";

      await connection.query(
        `UPDATE products SET amount = amount ${operator} ? WHERE BINARY idusers = ? AND idproducts = ?`,
        [quantity, idusers, product.idproducts],
      );
    }

    // 2. Cabecera del movimiento con fecha y hora actuales.
    failureMessage = "No se pudo registrar el movimiento. Inténtelo de nuevo.";

    const [inserted] = await connection.query(
      "INSERT INTO movements (idusers, movement_type, date_movement) VALUES (?, ?, NOW())",
      [idusers, type],
    );

    // 3. Detalle en lote con el valor unitario aplicado en este momento.
    const detailValues = [];

    for (const product of products) {
      const unitValue =
        type === "salida" ? product.sale_value : product.purchase_value;

      detailValues.push(
        inserted.insertId,
        idusers,
        product.idproducts,
        product.product_name,
        product.product_code,
        product.category,
        quantities.get(product.idproducts),
        unitValue,
      );
    }

    const rowPlaceholders = products
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");

    await connection.query(
      `INSERT INTO movement_items (idmovements, idusers, idproducts, product_name, product_code, category, amount, unit_value) VALUES ${rowPlaceholders}`,
      detailValues,
    );

    await connection.commit();

    return res
      .status(200)
      .json({ message: "Movimiento registrado correctamente." });
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        // Si la transaccion ya cerro, no hay nada que deshacer.
      }
    }

    return res.status(500).json({ error: failureMessage });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = newMovement;
