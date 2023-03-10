const express = require("express");
const controller = require("../controllers/profile");

const router = express.Router();
// /profile/updateUser
router.post("/", controller.updateUser);
// /profile
router.get("/", controller.profile);

module.exports = router;
