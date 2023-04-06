const express = require("express");
const controller = require("../controllers/performance");

const router = express.Router();
// /profile
router.get("/", controller.performance);

module.exports = router;
