const express = require("express");
const controller = require("../controllers/tasks");

const router = express.Router();
// /profile
router.get("/", controller.tasks);
// router.get("/developers", controller.getDeveloperByProject);

module.exports = router;
