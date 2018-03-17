var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var index = require('./routes/index');
var users = require('./routes/users');
var Tool = require("./public/tool");
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
    var _tool = new Tool(_lv);
    app.set("tool", _tool);

    app.set('views', path.join(__dirname, 'public/web'));
  
    let color = {
      1: 'red',
      2: 'yellow',
      3: 'blue',
      4: 'green'
    }

    let level = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D'
    }

    let genMaker = (lv) => {
      return `color:${color[lv]}%7Clabel:${level[lv]}`
    }
    app.engine('.html', exphbs({
      extname: ".html",
      helpers: {
        G2Id: function(lat, lon, lv) {
          return _tool.fromGoogleToId(lat, lon, lv)
        },
        Id2G: function(id) {
          return _tool.fromIdToGoogle(id)
        },
        gmap: function(lat, lon, lv) {
          return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=18&size=300x300&maptype=roadmap&markers=${genMaker(lv)}%7C${lat},${lon}&key=AIzaSyCHjhyaWs-swqQAPOU6e7i6buEE2boXG0A`          
        },
        gmapBanner: function(lat, lon, lv) {
          return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=18&size=640x200&scale=2&maptype=roadmap&markers=${genMaker(lv)}%7C${lat},${lon}&key=AIzaSyCHjhyaWs-swqQAPOU6e7i6buEE2boXG0A`
        },
        transLv : function(lv) {
          return _tool.transLv(lv)
        }
      }
    }));

    app.set('view engine', '.html');
  }
});
var app = express();
app.set('web3', web3);
app.set('ins', ins);
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

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
  console.log(err.stack);
    res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(JSON.stringify(res.locals.message));
  // render the error page
  return res.sendStatus(err.status || 500);  
});

module.exports = app;
