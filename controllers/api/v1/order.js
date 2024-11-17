let orders = [
    { id: 1, user: "John Doe", name: "John", order: "Hello", status: "Pending" }, //tijdelijke orders om te testen
    { id: 2, user: "Jane Smith", name: "Jane", order: "Hi", status: "Shipped" }
   
];

const index = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "GET All orders",
        data: orders,
    });
};

const show = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
        status: "success",
        message: `GETTING Order ${orderId}`,
        data: order,
    });
};

const create = (req, res) => {
    const { order } = req.body;

    if (!order) {
        return res.status(400).json({
            status: "error",
            message: "Please provide user and order details",
        });
    }

    // gebruiker is ingelogd, dus we kunnen de gebruiker uit de request halen
    const authenticatedUser = req.user; 

    // Maak een nieuwe order aan
    const newOrder = {
        id: orders.length + 1,
        user: authenticatedUser.email, 
        name: authenticatedUser.name, 
        order,
        status: 'Pending',
    };

    orders.push(newOrder);

    res.status(201).json({
        status: "success",
        message: "Order has been placed",
        data: newOrder,
    });
};

const update = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const { user, order: orderData } = req.body;

    order.user = user || order.user;
    order.order = orderData || order.order;

    res.status(200).json({
        status: "success",
        message: "Order updated",
        data: order,
    });
};

const patch = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.status) {
        order.status = req.body.status;
    }

    res.status(200).json({
        status: "success",
        message: "Order status updated",
        data: order,
    });
};

const destroy = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
    }

    orders.splice(orderIndex, 1);

    res.status(200).json({
        status: "success",
        message: "Order deleted",
        data: {
            id: orderId,
        },
    });
}

// winkelmandje

//winkelmandje toevoegen
const carts = {};
const addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    if (!carts[userId]) {
        carts[userId] = [];
    }

    const existingItem = carts[userId].find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[userId].push({ productId, quantity });
    }

    res.status(200).json({
        status: "success",
        message: "Product added to cart",
        data: carts[userId],
    });
}

// winkelmandje tonen
const viewCart = (req, res) => {
    const userId = req.user.id;
    console.log("User ID", userId);
    console.log("Carts", carts);
    if(!carts[userId] || carts[userId].length === 0) { //als de gebruiker geen winkelmandje heeft
        return res.status(200).json({
            status: "succes",
            message: "Cart is empty",
            data: [],
        });
    }

    //geeft de producten in het winkelmandje van de gebruiker
    res.status(200).json({
        status: "success",
        message: "Cart items",
        data: carts[userId],
    });
}

// winkelmandje leegmaken
const clearCart = (req, res) => {
    const {productId} = req.params;
    const userId = req.user.id;
    if(!carts[userId] || carts[userId].length === 0) {
        return res.status(200).json({
            status: "success",
            message: "Cart already empty",
        });
    }
    
    const productIndex = carts[userId].findIndex(item => item.productId === parseInt(productId)); //vindt het product in het winkelmandje

    if (productIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "Product not found in cart",
        });
    }

    carts[userId].splice(productIndex, 1); //verwijderd het product uit het winkelmandje

    res.status(200).json({
        status: "success",
        message: "Cart cleared",
        data: carts[userId],
    });
}

module.exports = {
    index,
    show,
    create,
    update,
    patch,
    destroy,

    viewCart,
    clearCart,
    addToCart,
};


//juiste code
// const index = (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "GET All orders",
//         data: {
//             messages: [
//                 {
//                     id: 1,
//                     user: "John",
//                     order: "Hello",
//                   },
//                   {
//                     id: 2,
//                     user: "Jane",
//                     order: "Hi"
//                   }
//             ]
//         }
//     });
// };

// const show = (req, res) => {
//     res.status(200).json({ 
//         status: "success",
//         message: "GETTING 1 order",
//         data: {
//             message: 
//                 {
//                     id: req.params.id,
//                     user: req.body.user,
//                     order: req.body.order,
            
//                 },
            
//         }
//      });
// }

// const create = (req, res) => {
//     const user = req.body.user; 
//     const order = req.body.order;
//     // const { customer, shippingAddress, billingAddress, orderDetails, specialInstructions } = req.body;
//     res.status(200).json({ 
//         status: "success",
//         message: "order has been placed",
//         data: {
//             message: 
//                 {
//                     user: user,
//                     order: order,
//                 }
//             // customer,
//             // shippingAddress,
//             // billingAddress,
//             // orderDetails,
//             // specialInstructions
//         }
//     });
// };

// const update = (req, res, next) => {
//     res.status(200).json({ 
//         status: "success",
//         message: "order updated",
//         data: {
//             user: req.body.user,
//             order: req.body.order,
            
//           },
      
//      });
// }

// let orders = [
//     { id: 1, customer: "John Doe", status: "Pending" },
//     { id: 2, customer: "Jane Smith", status: "Shipped" }
// ]; 

// const patch = (req, res) => {
//     const orderId = parseInt(req.params.id, 10);
//     const order = orders.find(o => o.id === orderId);

//     if (!order) {
//         return res.status(404).json({ message: 'Order not found' });
//     }

//     Object.keys(req.body).forEach(key => {
//         if (key in order) {
//             order[key] = req.body[key];
//         }
//     });

//     res.status(200).json(order);
// };


// const destroy = (req, res) => {
//     res.status(200).json({ 
//         status: "success",
//         message: "order deleted",
//         data: {
//             message: {
//                 _id: req.params.id,

//             }
//         }
//      });
// }

// module.exports = {
//     index,
//     show,
//     create,
//     update,
//     patch,
//     destroy
// };