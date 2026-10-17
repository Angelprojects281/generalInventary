var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const register = require("../controllers/users/register");
const logIn = require("../controllers/users/logIn");
const getAccount = require("../controllers/users/getAccount");
const updateAccount = require("../controllers/users/updateAccount");
const changePassword = require("../controllers/users/changePassword");
const deleteAccount = require("../controllers/users/deleteAccount");
const newCategory = require("../controllers/category/newCategory");
const deleteCategory = require("../controllers/category/deleteCategory");
const newProduct = require("../controllers/products/newProduct");
const deleteProduct = require("../controllers/products/deleteProduct");
const listCategories = require("../controllers/category/listCategory");
const filterProducts = require("../controllers/products/filterProducts");
const newMovement = require("../controllers/movements/newMovement");
const filterMovements = require("../controllers/movements/filterMovements");
const newProvider = require("../controllers/providers/newProvider");
const listProviders = require("../controllers/providers/listProviders");
const deleteProvider = require("../controllers/providers/deleteProvider");
const updateCategory = require("../controllers/category/updateCategory");
const updateProvider = require("../controllers/providers/updateProvider");
const updateProduct = require("../controllers/products/updateProduct");

// Rutas publicas: registro e inicio de sesion.
router.post("/register", register);

router.post("/logIn", logIn);

// Todo lo demas exige un JWT valido; cada cuenta solo accede a su
// propio inventario mediante req.user.idusers.
router.get("/accountInfo", auth, getAccount);

router.put("/updateAccount", auth, updateAccount);

router.post("/changePassword", auth, changePassword);

router.delete("/deleteAccount", auth, deleteAccount);

router.post("/newCategory", auth, newCategory);

router.delete("/deleteCategory/:categoryName", auth, deleteCategory);

router.post("/newProduct", auth, newProduct);

router.delete("/deleteProduct/:product_name", auth, deleteProduct);

router.get("/listCategories", auth, listCategories);

router.get("/filterProducts", auth, filterProducts);

router.post("/newMovement", auth, newMovement);

router.get("/filterMovements", auth, filterMovements);

router.post("/newProvider", auth, newProvider);

router.get("/listProviders", auth, listProviders);

router.delete("/deleteProvider/:provider_name", auth, deleteProvider);

router.put("/updateCategory", auth, updateCategory);

router.put("/updateProvider", auth, updateProvider);

router.put("/updateProduct", auth, updateProduct);

module.exports = router;
