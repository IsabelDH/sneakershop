const express = require('express');
const router = express.Router();
const { addToCart, viewCart, removeFromCart } = require('../../../controllers/api/v1/cart');
const { checkAuthentication, checkAdmin } = require('../../../middleware/authMiddleware'); 

router.post('/', checkAuthentication, addToCart);
router.get('/', checkAuthentication, viewCart);
router.delete('/:id', checkAuthentication, removeFromCart);

module.exports = router;