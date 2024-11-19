const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    selectedColor: {
        type: String,
        required: true
    },
    selectedLaceColor: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;