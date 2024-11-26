const ordersRouter = require('express').Router();
const orders = require('../../../models/Order'); // Importeer het Order model

//alle orders ophalen
const index =async (req, res) => {
    try {
        const allOrders = await orders.find();
        res.status(200).json({
            status: "success",
            message: "GET All orders",
            data: allOrders,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get orders",
        });
    }
}

//een enkele order ophalen
const show = async (req, res) => {
    try {
        const orderId = req.params.id;
        // Controleer of de ID geldig is
        if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        const order = await orders.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            status: "success",
            message: `GETTING Order ${orderId}`,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get order",
        });
    }
}

//een nieuwe order aanmaken
const create = async (req, res) => {
    try {
        const { user, email, address, order } = req.body;

         // Controleer of de vereiste velden aanwezig zijn
         if (!user || !email || !address || !order) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields",
            });
        }


        const newOrder = new orders({ user, email, address, order, status: "new order"   });
        const savedOrder = await newOrder.save();
      
        // Verzend de nieuwe order via Socket.io
        if (req.app.io) {  // Controleer of io beschikbaar is
            req.app.io.emit('new order', savedOrder); 
        } else {
            console.error("Socket.io instance not available");
        }
        res.status(201).json({
            status: "success",
            message: "Order has been placed",
            data: savedOrder,
        });
    } catch (error) {
        console.error("Error while placing order:", error);  // Log de fout op de server
        res.status(500).json({
            status: "error",
            message: "Failed to place order",
            error: error.message,  // Voeg de foutmelding toe aan de response
        });
    }
}

//een order updaten
const update = async (req, res) => { 
    try {
        const updatedOrder = await orders.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            status: "success",
            message: "Order updated",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to update order",
        });
    }
}

const patch = async (req, res) => {
    try {
        const updatedOrder = await orders.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            status: "success",
            message: "Order status updated",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to update order",
        });
    }
}

//een order verwijderen
const destroy = async (req, res) => {
    try {
        const deletedOrder = await orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            status: "success",
            message: "Order deleted",
            data: deletedOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to delete order",
        });
    }
}

module.exports = {
    index,
    show,
    create,
    update,
    patch,
    destroy,
};

