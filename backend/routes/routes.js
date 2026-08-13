var express = require("express");
var router = express.Router();

const newUser = require("../controllers/users/newUser");
const logIn = require("../controllers/users/logIn");
const listUsers = require("../controllers/users/listUsers");
const changePassword = require("../controllers/users/changePassword");
const deleteUser = require("../controllers/users/deleteUser");

router.post("/newUser", newUser);

router.post("/logIn", logIn);

router.get("/listUsers", listUsers);

router.post("/changePassword", changePassword);

router.delete("/deleteUser", deleteUser);

module.exports = router;
