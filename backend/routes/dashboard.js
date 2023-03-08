const express = require("express");
const controller = require("../controllers/dashboard");

const router = express.Router();

router.get("/", controller.home);
router.get("/tasks", controller.home);
router.get("/profile", controller.home);
router.get("/logout", controller.logout);
module.exports = router;
