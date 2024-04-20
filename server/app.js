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
app.use(express.static(path.join(__dirname, '../client/dist')));


// view engine setup
app.set('views', path.join(__dirname,'views'));

app.set('view engine', 'jade');
// Serve static files from the React app




app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use('/', indexRouter);
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

// // Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


__dirname = path.resolve()

console.log(__dirname)



module.exports = app;
