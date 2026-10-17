const db = require("../../db/db");

const getAccount = (req, res) => {
  const accountQuery =
    "SELECT idusers, company_name FROM users WHERE BINARY idusers = ?";

  db.query(accountQuery, [req.user.idusers], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "No se pudo cargar la cuenta. Inténtelo de nuevo.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        error: "La cuenta no existe o ya fue eliminada.",
      });
    }

    return res.status(200).json({
      idusers: results[0].idusers,
      companyName: results[0].company_name,
    });
  });
};

module.exports = getAccount;
