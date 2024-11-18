const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://r0677456:2t7GtLriVisd8ZF1@sneaker.fxq0g.mongodb.net/Sneakershop');
        console.log('MongoDB Connected: ${conn.connection.host}');
    }catch (err){
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;