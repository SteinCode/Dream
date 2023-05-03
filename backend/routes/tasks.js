const express = require("express");
const controller = require("../controllers/tasks");

const router = express.Router();
// /profile
router.get("/", controller.tasks);
router.post("/create-task", controller.createTask);
router.put("/update-task-status/:id", controller.updateTaskStatus);
router.delete("/delete-task/:id", controller.deleteTask);
module.exports = router;
