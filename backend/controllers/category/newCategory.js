const db = require("../../db/db");

const newCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio.",
    });
  }

  const checkQuery = "SELECT * FROM categories WHERE category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar la categoría. Inténtelo de nuevo.",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya existe una categoría con ese nombre.",
      });
    }

    const query = "INSERT INTO categories (category) VALUES (?)";

    db.query(query, [categoryName], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo crear la categoría. Inténtelo de nuevo.",
        });
      }

      return res
        .status(200)
        .json({ message: "Categoría creada correctamente." });
    });
  });
};

module.exports = newCategory;
