const CartItem = require('../../../models/CartItem');
const Product = require('../../../models/Product');

const addToCart = async (req, res) => {
    try {
        const { productId, selectedColor, selectedLaceColor, quantity } = req.body;
        const userId = req.user._id; // Authenticated user ID

        // Controleer of het product bestaat
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Valideer de kleurkeuzes
        if (!product.colors.includes(selectedColor) || !product.laceColors.includes(selectedLaceColor)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid color or lace color selection',
            });
        }

        // Voeg het product toe aan het winkelmandje
        const cartItem = new CartItem({
            userId,
            productId,
            selectedColor,
            selectedLaceColor,
            quantity,
        });
        await cartItem.save();

        res.status(201).json({
            status: 'success',
            message: 'Product added to cart',
            data: cartItem,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
};

const viewCart = async (req, res) =>{
    try {
        const userId = req.user._id;
        const cartItems = await CartItem.find({ userId }).populate('productId');
        res.json({
            status: 'success',
            data: cartItems,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItemId = req.params.id;
        const cartItem = await CartItem.findOne({ userId, _id: cartItemId });
        if (!cartItem) {
            return res.status(404).json({ status: 'error', message: 'Cart item not found' });
        }
        await cartItem.remove();
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
}

module.exports = {
    addToCart,
    viewCart,
    removeFromCart,
};