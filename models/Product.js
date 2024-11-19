const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    colors: {type: [String]},
    laceColors: {type: [String]},
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;