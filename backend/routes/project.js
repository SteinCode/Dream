const express = require("express");
const controller = require("../controllers/project");

const router = express.Router();
// /profile/create-project
<<<<<<< HEAD
 router.post("/create-project", controller.addProject);
=======
router.post("/create-project", controller.addProject);
>>>>>>> develop
// /profile
router.get("/", controller.project);

module.exports = router;
