const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();
router.get("/", authController.home);
router.get("/logout", authController.logout);
router.post("/register", authController.register);
router.get("/login", authController.renderLogin);
router.post("/login", authController.login);

module.exports = router;
