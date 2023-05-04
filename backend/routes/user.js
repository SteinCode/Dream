const express = require("express");
const controller = require("../controllers/user");

const router = express.Router();
// /profile
router.get("/get-logged-user", controller.getLoggedUserId);
module.exports = router;
