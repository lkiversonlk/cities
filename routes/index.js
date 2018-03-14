var express = require('express');
var router = express.Router();
const async = require("async");
var data = require("../public/assets/data/listTokens.json");

const readline = require("readline");
const fs = require("fs")
const path = require("path")
const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, "../public/assets/data/tokens.csv"))
})

let tokens = []
let cities = {}

rl.on('line', (line) => {
  let _dat = line.split(',')
  if(_dat.length == 5) {
    try{
      let lat = parseFloat(_dat[0])
      let lon = parseFloat(_dat[1])
      let lv = parseInt(_dat[2])
      let city = _dat[3].trim()
      let cityName = _dat[4].trim()
      cities[city] = cityName
      tokens.push({lat, lon, lv, city, cityName})
    } catch(e) {
      console.log(e)
    }
  }
})

rl.on('close', () => {
  console.log(tokens)
})

router.get("/", (req, res) => {
  return res.render(
    'index', 
    {
      tokens,
      cities
    }
  );
})

router.get("/details/:id", (req, res) => {
  let tool = req.app.get("tool");
  let id = parseInt(req.params['id']);
  let data = tool.fromIdToGoogle(id);
  const async = require("async");

  if(data.err) {
    return res.send(`${id} is not valid`)
  } else {
    data = Object.assign(data, {id: req.params['id']})
    return res.render('details', data);
  }
})

router.get("/marketplace", (req, res) => {
  return res.render('marketplace', data);
  /*
  let tool = req.app.get("tool");
  let id = parseInt(req.params['id']);
  let data = tool.fromIdToLonLat(id);
  if(data.err) {
    return res.send(`${id} is not valid`)
  } else {
    return res.render('details', {
      id: req.params['id'],
      data
    });
  }*/
})

router.get("/faq", (req, res) => {
  return res.render('faq', data);
  /*
  let tool = req.app.get("tool");
  let id = parseInt(req.params['id']);
  let data = tool.fromIdToLonLat(id);
  if(data.err) {
    return res.send(`${id} is not valid`)
  } else {
    return res.render('details', {
      id: req.params['id'],
      data
    });
  }*/
})

router.get('/mytokens', (req, res) => {
  return res.render('mytokens');
})

router.get('/mytokens/:address', (req, res) => {
  let ins = req.app.get('ins');
  let address = req.params['address'];
  ins.balanceOf(address, (err, _len) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      let len = _len.toNumber();
      async.times(
        len,
        (i, next) => {
          ins.owned(address, i, (err, id) => {
            if(err) {
              return next(err)
            } else {
              ins.positions(i, (err, token) => {
                if(err) {
                  return next(err)
                } else {
                  return next(null, {i, token})
                }
              });
            }
          })
        },
        (err, tokens) => {
          if(err) {
            res.sendStatus(500);
          } else {
            let tool = req.app.get("tool");
            let data = tokens.map(t => {
              let id = t.i
              return tool.fromIdToGoogle(id)
            });
            return res.render('mytokens', data);
          }
        }
      )
    }
  });
});

module.exports = router;
