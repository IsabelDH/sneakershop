const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    shoename:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    material:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    charm: {
        type: {
          name: { type: String, required: true },
          position: { type: String, required: true }
        },
        required: true
    },
    quantity:{
        type: Number,
        default: 1
    }
});

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
    nameOrder:{
        type: String,
        required: true
    },
    order:{
        type: [OrderItemSchema],
        required: true
    },
    status:{
        type: String,
        enum:['New order', 'Cancelled', 'Pending', 'Delivered'],
        default: 'New order',
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