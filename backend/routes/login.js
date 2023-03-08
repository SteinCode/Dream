const express = require("express");
const controller = require("../controllers/login");

const router = express.Router();

router.get("/", controller.loginRender);
router.post("/", controller.loginValidate);

module.exports = router;
