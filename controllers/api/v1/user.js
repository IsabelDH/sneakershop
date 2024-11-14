const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Voorbeeld van gebruikers, met hun rollen
const users = [
  {
    id: 1,
    email: "admin@admin.com",
    password: "Admin", 
    role: "admin", 
  },
  {
    id: 2,
    email: "user@user.com",
    password: "123", 
    role: "user", 
  }
];

// Login functie
const login = async (req, res) => {
    const { email, password } = req.body;

    // Zoek naar de gebruiker met de opgegeven email
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({
            status: "error",
            message: "Invalid email or password"
        });
    }

    // Vergelijk wachtwoorden (zonder bcrypt omdat we geen hash gebruiken voor demo)
    if (password !== user.password) {
        return res.status(401).json({
            status: "error",
            message: "Invalid email or password"
        });
    }

    // Genereer JWT-token en voeg de rol van de gebruiker toe aan de payload
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret', // Dit moet in een .env bestand staan in productie
        { expiresIn: '1h' }
    );

    res.status(200).json({
        status: "success",
        message: "Login successful",
        token: token,
    });
};
//logout functie
const logout = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "User logged out"
    });
}

const register = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            status: "error",
            message: "Please provide email and password"
        });
    }

    const userExists = users.some((user) => user.email === email);
    if(userExists){
        return res.status(400).json({
            status: "error",
            message: "Email already exists"
        });
    }

     // Het wachtwoord hashen
    // const hashedPassword = await bcrypt.hash(password, 10);

    //onze user "opslaan"
    const newUser = {
        id: users.lenght + 1, 
        email,
        password};
    users.push(newUser);

    res.status(201).json({
        status: "success",
        message: "User created",
        data: newUser
    });
}
module.exports = { login, logout, register };