var express = require("express");
var router = express.Router();

const newUser = require("../controllers/users/newUser");
const logIn = require("../controllers/users/logIn");

router.post("/newUser", newUser);

router.post("/logIn", logIn);

module.exports = router;
