const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    order:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:['new order', 'cancelled', 'pending'],
        default: 'pending',
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);