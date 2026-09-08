const db = require("../../db/db");

const newCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({
      error:
        "Falta el nombre de la categoría. Ingresa una categoría para continuar.",
    });
  }

  const checkQuery = "SELECT * FROM categories WHERE category = ?";

  db.query(checkQuery, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({
        error:
          "No pudimos verificar la categoría en este momento. Inténtalo nuevamente.",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "La categoría ya existe. Ingresa otro nombre.",
      });
    }

    const query = "INSERT INTO categories (category) VALUES (?)";

    db.query(query, [categoryName], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo crear la categoría. Inténtalo nuevamente.",
        });
      }

      return res
        .status(200)
        .json({ message: "Categoría creada correctamente." });
    });
  });
};

module.exports = newCategory;
