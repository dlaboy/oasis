var createError = require('http-errors');
var express = require('express');

var cors = require('cors');
var path = require('path');
var logger = require('morgan');

require('./db.js')

const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

dotenv.config();



var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var ordersRouter = require('./routes/orders.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'jade');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);


// Cors settings 
const corsOptions = {
  origin: '*', 
  allowedHeaders: 'Content-Type', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
 
};


app.use(cors(corsOptions));


app.listen(PORT, () =>{
  console.log("server started")
})


__dirname = path.resolve()

module.exports = app;