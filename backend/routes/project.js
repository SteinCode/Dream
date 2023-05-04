const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();
// /profile/create-project
router.post("/create-project", controller.addProject);
// /profile
router.get("/", controller.project);

// /profile/delete-project
router.delete("/delete-project/:projectID", controller.deleteProject);

// /profile/update-project
router.put("/update-project/:projectID", controller.updateProject);

module.exports = router;
