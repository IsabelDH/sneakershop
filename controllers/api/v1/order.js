const create = (req, res) => {
    const user = req.body.user; 
    const text = req.body.text;
    res.status(200).json({ 
        status: "success",
        message: "orders saved",
        data: {
            message: 
                {
                    user: user,
                    text: text,
                }
            
        }
    });
};

module.exports = {
    create
};