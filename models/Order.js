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
        enum:['new order', 'cancelled', 'pending', 'delivered'],
        default: 'new order',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    shippedAt: {
        type: Date,  // Slaat de tijd op wanneer de order verzonden wordt
        default: null
    }
});

OrderSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'delivered' && !this.shippedAt) {
        this.shippedAt = Date.now();  // Stel shippedAt in bij statuswijziging naar "delivered"
    }
    this.updatedAt = Date.now();  // Werk updatedAt bij bij elke wijziging
    next();
});

module.exports = mongoose.model('Order', OrderSchema);