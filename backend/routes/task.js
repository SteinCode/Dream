const express = require("express");
const controller = require("../controllers/task");

const router = express.Router();
// /profile
router.get("/", controller.task);
router.post("/create-task", controller.createTask);
router.put("/update-task-status/:id", controller.updateTaskStatus);
router.delete("/delete-task/:id", controller.deleteTask);
module.exports = router;
