
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
var employeeRouter = require('./routes/employees.js');
var loginRouter = require('./routes/logins.js');
var salesRouter = require('./routes/sales.js');
var ingredienteRouter = require('./routes/ingredientes.js')
var toppingRouter = require('./routes/toppings.js')
var favoritesRouter = require('./routes/favorites.js')
var fileUploadRouter = require('./routes/upload.js')
const WebSocket = require('ws');


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
app.use('/employee', employeeRouter);
app.use('/login', loginRouter);
app.use('/sales', salesRouter);
app.use('/ingrediente',ingredienteRouter);
app.use('/topping',toppingRouter);
app.use('/favorite',favoritesRouter);
app.use('/upload',fileUploadRouter);



// Cors settings 
const corsOptions = {
  origin: '*', 
  allowedHeaders: 'Content-Type', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
 
};

app.use(cors(corsOptions));

// // Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


const server  = app.listen(PORT, async () =>{
  console.log("server started")
  console.log("127.0.0.1:3000")
  if (PORT == 3000){
    const open = await import('open');

    open.default(`http://127.0.0.1:${PORT}`);

  }


})



// Attach WebSocket server to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('Welcome to the WebSocket server!');
});


module.exports = app;
