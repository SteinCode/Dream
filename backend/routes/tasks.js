const express = require("express");
const controller = require("../controllers/tasks");

const router = express.Router();
// /profile
router.get("/", controller.tasks);
// router.get("/developers", controller.getDeveloperByProject); //this temporary returns all developers only without checking the project
router.post("/create-task", controller.createTask);
router.put("/update-task-status/:id", controller.updateTaskStatus);
module.exports = router;
