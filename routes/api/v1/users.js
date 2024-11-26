const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/api/v1/user");
const { checkAuthentication } = require("../../../middleware/authMiddleware");

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);
//router.put("/updatepassword", checkAuthentication, userController.updatepassword);

module.exports = router;