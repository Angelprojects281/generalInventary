var express = require("express");
var router = express.Router();

const newUser = require("../controllers/users/newUser");
const logIn = require("../controllers/users/logIn");
const listUsers = require("../controllers/users/listUsers");
const changePassword = require("../controllers/users/changePassword");

router.post("/newUser", newUser);

router.post("/logIn", logIn);

router.get("/listUsers", listUsers);

router.post("/changePassword", changePassword);

module.exports = router;
