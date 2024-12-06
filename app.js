const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./db');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');

connectDB();

const ordersRouter = require('./routes/api/v1/orders');
const usersRouter = require('./routes/api/v1/users');
const productsRouter = require('./routes/api/v1/products');
const cartRouter = require('./routes/api/v1/cart');

const app = express();

const server = http.createServer(app); // Attach the Express app to the HTTP server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from localhost (your Vue app)
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'], // Allow GET and POST methods
    allowedHeaders: ['Content-Type',  'Authorization'], // Specify allowed headers
    credentials: true, // Allow cookies and authentication headers
  }
});

app.use(cors({
  origin: 'http://localhost:5173', // Zorg ervoor dat de juiste frontend URL wordt toegelaten
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);

app.use((req, res, next) => {
  req.io = io; // Attach io to req
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  // Example event
  socket.on('test event', (data) => {
    console.log('Received from client:', data);
    socket.emit('server response', { message: 'Hello from server!' });
  });
});

module.exports = app;
