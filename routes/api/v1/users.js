const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/api/v1/user");
const { checkAuthentication } = require("../../../middleware/authMiddleware");

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);
router.put("/update-password", checkAuthentication, userController.updatePassword);

module.exports = router;