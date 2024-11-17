const express = require("express");
const router = express.Router();
const { checkAuthentication, checkAdmin } = require('../../../middleware/authMiddleware'); 
const orderController = require("../../../controllers/api/v1/order");

// Winkelmand route
router.post("/cart", checkAuthentication, orderController.addToCart);
router.get("/cart", checkAuthentication, orderController.viewCart);
router.delete("/cart", checkAuthentication, orderController.clearCart);
router.delete("/cart/:productId", checkAuthentication, orderController.clearCart);

//dynamische routes
router.get("/", checkAuthentication,orderController.index);

router.get("/:id", checkAuthentication, orderController.show);

router.post("/", checkAuthentication, orderController.create);

router.put("/:id", checkAdmin, orderController.update);

router.patch("/:id", checkAdmin, orderController.patch);

router.delete("/:id", checkAdmin, orderController.destroy);




module.exports = router;