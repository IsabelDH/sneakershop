const express = require("express");
const router = express.Router();
const { checkAuthentication, checkAdmin } = require('../../../middleware/authMiddleware'); 
const orderController = require("../../../controllers/api/v1/order");

//dynamische routes
router.get("/", checkAuthentication,orderController.index);
router.get("/:id", checkAuthentication, orderController.show);
router.post("/", orderController.create);
router.put("/:id", checkAuthentication, checkAdmin, orderController.update);
router.patch("/:id", checkAuthentication, checkAdmin, orderController.patch);
router.delete("/:id", checkAuthentication, checkAdmin, orderController.destroy);




module.exports = router;