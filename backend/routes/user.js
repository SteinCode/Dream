const express = require("express");
const controller = require("../controllers/user");

const router = express.Router();

router.put("/", controller.updateUser);

module.exports = router;
