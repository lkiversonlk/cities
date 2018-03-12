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
var Web3 = require("web3");

var web3 = new Web3();

let config = require("./public/config.json");

var networkMap = {
  "1": "mainnet",
  "3": "ropsten"
};

if(!networkMap.hasOwnProperty(config.current)) {
  throw `network ${config.current} is not supported`
}

web3.setProvider(new web3.providers.HttpProvider(`https://${networkMap[config.current]}.infura.io/vAugb8H4cG1bOuFMZj3y`));
let contract = web3.eth.contract(config.configs[config.current].abi);
let ins = contract.at(config.configs[config.current].addr);



ins.maxLv((err, lv) => {
  if(err) {
    console.log(err);
    process.exit(-1);
  } else {
    let _lv = lv.toNumber();
    console.log(`connected to ${config.configs[config.current].addr}, lv ${_lv}`)
    app.set("tool", new Tool(_lv));
  }
});
var app = express();
app.set('ins', ins);
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public/web'));

app.engine('.html', exphbs({
  extname: ".html",
  helpers: {
    gmap: function(lat, lon) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${90-lat},${lon-180}&zoom=18&size=300x300&maptype=roadmap&markers=color:blue%7Clabel:C%7C${90-lat},${lon-180}&key=AIzaSyCHjhyaWs-swqQAPOU6e7i6buEE2boXG0A`
    }
  }
}));

app.set('view engine', '.html');

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
