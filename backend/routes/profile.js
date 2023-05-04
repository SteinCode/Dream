const express = require("express");
const controller = require("../controllers/profile");

const router = express.Router();
// /profile
router.get("/", controller.profile);
// /profile/updateUser
router.post("/update-user", controller.updateUser);
// /profile/deleteUser/:id
router.delete("/delete-user/:id", controller.deleteUser);
module.exports = router;
