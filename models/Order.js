const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
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
        default: 'new order',
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);