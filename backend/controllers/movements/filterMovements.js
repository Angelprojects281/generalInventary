const db = require("../../db/db");

const filterMovements = (req, res) => {
  const {
    type,
    category_name,
    product_name,
    product_code,
    initDate,
    finalDate,
  } = req.query;
  const idusers = req.user.idusers;

  let principalQuery = `
    SELECT
      m.idmovements,
      m.movement_type,
      m.date_movement,
      i.product_name,
      i.product_code,
      i.category,
      i.amount,
      i.unit_value
    FROM movements m
    INNER JOIN movement_items i
      ON i.idmovements = m.idmovements
    WHERE BINARY m.idusers = ?
  `;
  const values = [idusers];

  if (type) {
    principalQuery += " AND m.movement_type = ?";
    values.push(type);
  }

  if (category_name) {
    principalQuery += " AND i.category = ?";
    values.push(category_name);
  }

  if (product_name) {
    principalQuery += " AND i.product_name = ?";
    values.push(product_name);
  }

  if (product_code) {
    principalQuery += " AND i.product_code = ?";
    values.push(product_code);
  }

  if (initDate && finalDate) {
    // DATE_ADD cubre tambien el ultimo dia del rango (fecha y hora).
    principalQuery +=
      " AND m.date_movement >= ? AND m.date_movement < DATE_ADD(?, INTERVAL 1 DAY)";
    values.push(initDate, finalDate);
  }

  principalQuery += " ORDER BY m.date_movement DESC, m.idmovements DESC";

  db.query(principalQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudieron cargar los movimientos. Inténtelo de nuevo.",
      });
    }

    // Agrupar las lineas de detalle en un movimiento por cada cabecera,
    // con el total del movimiento (suma de cantidad por valor unitario).
    const movements = [];
    const movementById = new Map();

    for (const row of results) {
      let movement = movementById.get(row.idmovements);

      if (!movement) {
        movement = {
          idmovements: row.idmovements,
          movement_type: row.movement_type,
          date_movement: row.date_movement,
          total: 0,
          items: [],
        };
        movementById.set(row.idmovements, movement);
        movements.push(movement);
      }

      // mysql2 devuelve DECIMAL como cadena; se convierte para calcular.
      const unitValue = Number(row.unit_value);
      const lineValue = Math.round(Number(row.amount) * unitValue * 100) / 100;

      movement.total = Math.round((movement.total + lineValue) * 100) / 100;
      movement.items.push({
        product_name: row.product_name,
        product_code: row.product_code,
        category: row.category,
        amount: row.amount,
        unit_value: unitValue,
        line_value: lineValue,
      });
    }

    return res.status(200).json(movements);
  });
};

module.exports = filterMovements;
