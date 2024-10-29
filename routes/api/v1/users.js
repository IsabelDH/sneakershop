const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/api/v1/user");

router.post("/login", userController.login);

module.exports = router;