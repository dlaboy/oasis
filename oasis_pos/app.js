var createError = require('http-errors');
var express = require('express');

var cors = require('cors');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./db.js')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.js');
var ordersRouter = require('./routes/orders.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

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

// Cors settings 
const corsOptions = {
  origin: '*', 
  allowedHeaders: 'Content-Type', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // credentials: true
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production"){
  app.use(express.static("client/public"))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build" ,"index.html"));
  })
}


app.listen(process.env.PORT || 3001, function () {
  console.log('CORS-enabled web server listening on port 3001')
})

module.exports = app;
