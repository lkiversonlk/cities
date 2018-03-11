var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var index = require('./routes/index');
var users = require('./routes/users');
var Tool = require("./routes/id");

var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public/web'));

let Config = {
  lv : 4
}

app.engine('.html', exphbs({
  extname: ".html",
  helpers: {
  }
}));

app.set('view engine', '.html');
app.set("tool", new Tool(Config.lv));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(JSON.stringify(res.locals.message));
  // render the error page
  return res.sendStatus(err.status || 500);  
});

module.exports = app;
