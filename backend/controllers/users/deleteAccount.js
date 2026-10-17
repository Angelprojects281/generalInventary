const db = require("../../db/db");
const bcrypt = require("bcrypt");

const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const idusers = req.user.idusers;

  if (!password) {
    return res.status(400).json({
      error: "Confirme su contraseña para eliminar la cuenta.",
    });
  }

  const accountQuery = "SELECT * FROM users WHERE BINARY idusers = ?";

  db.query(accountQuery, [idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo verificar la cuenta. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "La cuenta no existe o ya fue eliminada.",
      });
    }

    const passwordMatch = bcrypt.compareSync(password, results[0].password);

    if (!passwordMatch) {
      return res.status(400).json({
        error: "La contraseña es incorrecta.",
      });
    }

    // Se elimina primero lo que referencia a productos y proveedores,
    // después los productos y por ultimo la cuenta. De este modo no
    // depende del orden de las cascadas de la base de datos.
    const deleteMovements = "DELETE FROM movements WHERE BINARY idusers = ?";
    const deleteProducts = "DELETE FROM products WHERE BINARY idusers = ?";
    const deleteProviders = "DELETE FROM providers WHERE BINARY idusers = ?";
    const deleteCategories = "DELETE FROM categories WHERE BINARY idusers = ?";
    const deleteUser = "DELETE FROM users WHERE BINARY idusers = ?";

    db.query(deleteMovements, [idusers], (err) => {
      if (err) {
        return res.status(500).json({
          error: "No se pudo eliminar el historial. Inténtelo de nuevo.",
        });
      }

      db.query(deleteProducts, [idusers], (err) => {
        if (err) {
          return res.status(500).json({
            error: "No se pudieron eliminar los productos. Inténtelo de nuevo.",
          });
        }

        db.query(deleteProviders, [idusers], (err) => {
          if (err) {
            return res.status(500).json({
              error:
                "No se pudieron eliminar los proveedores. Inténtelo de nuevo.",
            });
          }

          db.query(deleteCategories, [idusers], (err) => {
            if (err) {
              return res.status(500).json({
                error:
                  "No se pudieron eliminar las categorías. Inténtelo de nuevo.",
              });
            }

            db.query(deleteUser, [idusers], (err) => {
              if (err) {
                return res.status(500).json({
                  error: "No se pudo eliminar la cuenta. Inténtelo de nuevo.",
                });
              }

              return res.status(200).json({
                message: "La cuenta y su inventario se eliminaron correctamente.",
              });
            });
          });
        });
      });
    });
  });
};

module.exports = deleteAccount;
