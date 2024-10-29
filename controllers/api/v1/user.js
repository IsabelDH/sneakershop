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

module.exports = { login };