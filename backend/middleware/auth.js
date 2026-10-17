const jwt = require("jsonwebtoken");

require("dotenv").config({
  path: __dirname + "/../secretKey.env",
});

const auth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "La sesión no es válida. Inicie sesión de nuevo.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { idusers: payload.idusers };
    return next();
  } catch (err) {
    return res.status(401).json({
      error: "La sesión expiró. Inicie sesión de nuevo.",
    });
  }
};

module.exports = auth;
