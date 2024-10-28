const express = require("express");
const router = express.Router();
const orderController = require("../../../controllers/api/v1/order");

router.get("/", orderController.index);

router.get("/:id", orderController.show);

router.post("/", orderController.create);

router.put("/:id", orderController.update);

router.patch("/:id", orderController.patch);

router.delete("/:id", orderController.destroy);



module.exports = router;