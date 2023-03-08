const express = require("express");
const controller = require("../controllers/register");

const router = express.Router();

router.get("/", controller.registerRender);
router.post("/", controller.registerUser);

module.exports = router;
