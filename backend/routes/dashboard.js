const express = require("express");
const controller = require("../controllers/dashboard");

const router = express.Router();

router.get("/", controller.home);
router.get("/tasks", controller.tasks);
router.get("/performance", controller.performance);
router.get("/logout", controller.logout);
router.post("/generate-invitation-code", controller.invitationCode);
module.exports = router;
