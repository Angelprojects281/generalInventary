var express = require("express");
var router = express.Router();

const newUser = require("../controllers/users/newUser");
const logIn = require("../controllers/users/logIn");
const listUsers = require("../controllers/users/filterUsers");
const changePassword = require("../controllers/users/changePassword");
const deleteUser = require("../controllers/users/deleteUser");
const newCategory = require("../controllers/category/newCategory");
const deleteCategory = require("../controllers/category/deleteCategory");
const newProduct = require("../controllers/products/newProduct");
const deleteProduct = require("../controllers/products/deleteProduct");
const listCategories = require("../controllers/category/listCategory");
const filterProducts = require("../controllers/products/filterProducts");
const newMovement = require("../controllers/movements/newMovement");
const filterMovements = require("../controllers/movements/filterMovements");

router.post("/newUser", newUser);

router.post("/logIn", logIn);

router.get("/listUsers", listUsers);

router.post("/changePassword", changePassword);

router.delete("/deleteUser/:idusers/:tokenUser", deleteUser);

router.post("/newCategory", newCategory);

router.delete("/deleteCategory/:categoryName", deleteCategory);

router.post("/newProduct", newProduct);

router.delete("/deleteProduct/:product_name", deleteProduct);

router.get("/listCategories", listCategories);

router.get("/filterProducts", filterProducts);

router.post("/newMovement", newMovement);

router.get("/filterMovements", filterMovements);

module.exports = router;
