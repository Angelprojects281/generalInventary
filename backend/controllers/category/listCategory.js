const db = require("../../db/db");

const listCategories = (req, res) => {
  const listQuery = "SELECT * FROM categories";

  db.query(listQuery, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error al consultar la base de datos" });
    }

    return res.status(200).json(results);
  });
};

module.exports = listCategories;
