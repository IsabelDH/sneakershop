const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongoose schema voor gebruiker
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "admin"]
    },
    address: { 
        type: String,
    },
});

// Hash het wachtwoord voordat het wordt opgeslagen in de database
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {  // Alleen hashen als het wachtwoord gewijzigd of nieuw is
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


// Vergelijk wachtwoorden bij inloggen
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);  // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord
};

// Maak het Mongoose model
const User = mongoose.model('User', userSchema);

// Exporteer het model
module.exports = User;
