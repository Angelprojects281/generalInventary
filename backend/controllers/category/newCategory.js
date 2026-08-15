const db = require("../../db/db");

const newCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res
      .status(400)
      .json({ error: "Error, falta el nombre de la categoria" });
  }

  const checkQuery = "SELECT * FROM categories WHERE BINARY category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al verificar la categoria" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Error, la categoria ya existe" });
    }

    const query = "INSERT INTO categories (category) VALUES (?)";

    db.query(query, [categoryName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al crear la categoria" });
      }

      return res.status(200).json({ message: "Categoria creada exitosamente" });
    });
  });
};

module.exports = newCategory;
