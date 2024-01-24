var createError = require('http-errors');
var express = require('express');

var cors = require('cors');
var path = require('path');
var logger = require('morgan');

require('./db.js')

const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

dotenv.config();



// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.js');
var ordersRouter = require('./routes/orders.js');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'server','views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// Cors settings 
const corsOptions = {
  origin: '*', 
  allowedHeaders: 'Content-Type', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // credentials: true
};


app.use(cors(corsOptions));

/**
 * Module dependencies.
 */

// var debug = require('debug')('server:server');
// var http = require('http');

/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

// /**
//  * Create HTTP server.
//  */

// var server = http.createServer(app);

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// // server.listen(port);

// // server.on('error', onError);
// // server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

/**
 * Event listener for HTTP server "error" event.
 */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
//   console.log('Listening on ' + bind)
// }

app.listen(PORT, () =>{
  console.log("server started")
})


console.log(process.env.NODE_ENV)
__dirname = path.resolve()

app.use(express.static('dist'));

// app.get("*", (req, res) => {
//   try {
//     res.sendFile(,function (err) {
//       if (err) {
//           console.error('Error sending file:', err);
//       } else {
//           console.log('Sent:', fileName);
//       }
//     });
//   } catch (error) {
//     console.log("error",error)
//   }
// })







module.exports = app;
