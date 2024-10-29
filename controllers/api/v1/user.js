const users=[]; //tijdelijke array om een user in op te slaan

const login = async (req, res) => {
    const{ email, password} = req.body;

    const user ={
        id: 1,
        email: "test@test.com",
        password: "1234"
    }

    if(email !== user.email && await bcrypt.compare(password, user.password)){
        return res.status(401).json({
            status: "error",
            message: "Invalid mail of password"});
    }

    res.status(200).json({
        status: "success",
        message: "User logged in"
    });
}

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

    //onze user "opslaan"
    const newUser = {id: users.lenght+1, email, password};
    users.push(newUser);

    res.status(201).json({
        status: "success",
        message: "User created",
        data: newUser
    });
}
module.exports = { login, logout, register };