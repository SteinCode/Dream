const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();
// /profile/create-project
router.post("/create-project", controller.addProject);
// /profile
router.get("/", controller.project);

// /profile/create-project
router.delete("/delete-project/:projectID", controller.deleteProject);

module.exports = router;
