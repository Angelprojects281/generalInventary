var express = require("express");
var router = express.Router();

const newUser = require("../controllers/users/newUser");

router.post("/newUser", newUser);
module.exports = router;
