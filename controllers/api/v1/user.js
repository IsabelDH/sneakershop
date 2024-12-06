const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Zoek naar de gebruiker in de database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // Genereer JWT-token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

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
        const hashedPassword = await bcrypt.hash(password, 10);

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
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            error: error.message,
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

        const isMatch = await bcrypt.compare(password, user.password);
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


module.exports = { login, logout, register, updatepassword };