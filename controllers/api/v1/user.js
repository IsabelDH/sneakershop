const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

// Voorbeeld van gebruikers, met hun rollen
// const users = [
//   {
//     id: 1,
//     email: "admin@admin.com",
//     password: "Admin", 
//     name: "Admin",
//     role: "admin", 
//   },
//   {
//     id: 2,
//     email: "test@test.com",
//     password: "1234", 
//     name: "User",
//     role: "user", 
//   }
// ];

// Login functie
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     // Zoek naar de gebruiker met de opgegeven email
//     const user = users.find(u => u.email === email);

//     if (!user) {
//         return res.status(401).json({
//             status: "error",
//             message: "Invalid email or password"
//         });
//     }

//     // Vergelijk wachtwoorden (zonder bcrypt omdat we geen hash gebruiken voor demo)
//     if (password !== user.password) {
//         return res.status(401).json({
//             status: "error",
//             message: "Invalid email or password"
//         });
//     }

//     // Genereer JWT-token en voeg de rol van de gebruiker toe aan de payload
//     // Voeg name toe aan de payload in login
//     const token = jwt.sign(
//         { id: user.id, email: user.email, name: user.name, role: user.role }, // zorg dat name aanwezig is
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//     );


//     res.status(200).json({
//         status: "success",
//         message: "Login successful",
//         token: token,
//     });
// };

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


//logout functie
// const logout = (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "User logged out"
//     });
// }

const logout = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "User logged out",
    });
};

const register = async (req, res) => {
    const { email, password, name, role } = req.body;

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
            role, // Standaard rol
        });

        res.status(201).json({
            status: "success",
            message: "User created",
            data: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
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

// const register = async (req, res) =>{
//     const {email, password, name} = req.body;

//     if(!email || !password || !name){
//         return res.status(400).json({
//             status: "error",
//             message: "Please provide email and password"
//         });
//     }

//     const userExists = users.some((user) => user.email === email);
//     if(userExists){
//         return res.status(400).json({
//             status: "error",
//             message: "Email already exists"
//         });
//     }

//      // Het wachtwoord hashen
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     //onze user "opslaan"
//     const newUser = {
//         id: users.length  + 1, 
//         email,
//         password,
//         name,
//          role: "user"
// };
//     users.push(newUser);

//     res.status(201).json({
//         status: "success",
//         message: "User created",
//         data: newUser
//     });
// }
module.exports = { login, logout, register };