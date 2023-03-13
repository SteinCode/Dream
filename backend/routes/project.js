const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();
// /profile/create-project
 router.post("/create-project", controller.Addproject);
// /profile
router.get("/", controller.project);

module.exports = router;
