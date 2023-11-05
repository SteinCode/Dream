const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();

// /profile
router.get("/", controller.project);

// /profile/create-project
router.post("/create-project", controller.createProject);

// /profile/delete-project
router.delete("/delete-project/:projectID", controller.deleteProject);

// /profile/update-project
router.put("/update-project/:projectID", controller.updateProject);

module.exports = router;
