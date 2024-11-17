const mongoose = require('mongoose');

const OrderSchame = new mongoose.Schema({
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
        enum:['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchame);