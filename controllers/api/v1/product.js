const Product = require('../../../models/Product');

// Get all products
const index = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: "success",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get a single product
const show = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            status: "error",
            message: "Product not found"
        });
    }
}

// Create a new product
const create = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            status: "success",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Update a product
const update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.status(200).json({
            status: "success",
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            status: "error",
            message: "Product not found"
        });
    }
}

module.exports = { index, show, create, update };