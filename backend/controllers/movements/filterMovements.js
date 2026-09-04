const db = require("../../db/db");

const filterMovements = (req, res) => {
  const { type, category_name, product_name, initDate, finalDate } = req.query;
  let principalQuery = "SELECT * FROM movements WHERE 1=1";
  const values = [];

  if (type) {
    principalQuery += " AND movement_type = ?";
    values.push(type);
  }

  if (category_name) {
    principalQuery += " AND category = ?";
    values.push(category_name);
  }

  if (product_name) {
    principalQuery += " AND product_name = ?";
    values.push(product_name);
  }

  if (initDate && finalDate) {
    principalQuery += " AND date_movement >= ? AND date_movement <= ?";
    values.push(initDate, finalDate);
  }

  principalQuery += " ORDER BY date_movement DESC";

  db.query(principalQuery, values, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    return res.status(200).json(results);
  });
};

module.exports = filterMovements;
