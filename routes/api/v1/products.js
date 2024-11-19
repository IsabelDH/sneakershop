const express = require('express');
const router = express.Router();
const productController = require('../../../controllers/api/v1/product');

router.get('/', productController.index);
router.get('/:id', productController.show);
router.post('/', productController.create);
router.put('/:id', productController.update);

module.exports = router;