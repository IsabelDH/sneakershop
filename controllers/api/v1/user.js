const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Attempting to log in with email: ${email}`);
        // Zoek de gebruiker op basis van het e-mailadres
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
            // return res.status(401).json({
            //     status: "error",
            //     message: "Invalid email or password",
            // });
        }

        // Zorg ervoor dat het wachtwoord op de juiste manier wordt vergeleken
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // Genereer JWT-token voor de gebruiker
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Stuur de JWT-token terug in een cookie
        res.cookie('token', token, {
            httpOnly: true,  // Zorg ervoor dat de cookie niet toegankelijk is via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Zorg ervoor dat het alleen werkt via HTTPS in productie
            maxAge: 3600000,  // 1 uur
        });

        // Stuur het succesbericht terug
        res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            error: error.message,
        });
    }
};



const logout = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "User logged out",
    });
};

const register = async (req, res) => {
    const { email, password, name, role, address  } = req.body;

    try {
        // Controleer of de gebruiker al bestaat
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "error",
                message: "Email already exists",
            });
        }

        // Hash het wachtwoord
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Wachtwoord voor hashing:', password);
        console.log('Gehasht wachtwoord:', hashedPassword);

        // Maak een nieuwe gebruiker aan
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role, 
            address,
        });
        

        res.status(201).json({
            status: "success",
            message: "User created",
            data: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                address: newUser.address,
            },
        });
    } catch (error) {
        console.error(`Registration error: ${error.message}`);
        res.status(500).json({
            status: "error",
            message: "Error registering user",
        });
    }
};

const updatepassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: "error",
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            error: error.message,
        });
    }
};


module.exports = { login, logout, register };