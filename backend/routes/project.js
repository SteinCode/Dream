const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();

// /project
router.get("/", controller.project);

// /project/create-project
router.post("/create-project", controller.createProject);

// /project/delete-project
router.delete("/delete-project/:projectID", controller.deleteProject);

// /project/update-project
router.put("/update-project/:projectID", controller.updateProject);

// /project/set-active-project
router.put("/set-active-project/:projectID", controller.setActiveProject);

router.post("/add-attendant/:projectID/:attendantID", controller.addAttendant);

router.delete(
  "/delete-attendant/:projectID/:attendantID",
  controller.deleteAttendant
);

router.get("/get-attendants/:projectID", controller.getAttendants);

module.exports = router;
