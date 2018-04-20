var express = require('express');
var router = express.Router();
const async = require("async");
//var data = require("../public/assets/data/listTokens.json");
const data = require('./data');

router.get("/", (req, res) => {

  return res.render(
    'index', 
    data.getData()
  )
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

router.get("/test", (req, res) => {
  return res.render('details2')
})

router.get("/marketplace", (req, res) => {
  let city = req.query.city
  if (!city) {
    city = 'newyork'
  }

  let page = req.query.p
  if (!page) {
    page = 0
  } else {
    page = parseInt(page) - 1
  }

  let _data = data.getCityData(city)
  const cityPerPage = 12
  cities = _data.tokens
  if(!cities) {
    cities = []
  }
  const pages = Math.ceil(cities.length / cityPerPage)
  _data.tokens = cities.slice(page * cityPerPage, (page + 1) * cityPerPage)
  _data.pages = pages
  _data.page = page + 1
  _data.city = city
  _data.cityName = _data.cities[city]
  return res.render('marketplace2', _data)
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
  let web3 = req.app.get('web3')
  if(!web3.isAddress(req.params['address'])) {
    return res.send(`${req.params['address']} is invalid`)
  }
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
              id = id.toNumber()
              ins.positions(id, (err, token) => {
                if(err) {
                  return next(err)
                } else {
                  let owner = token[0]
                  let price = token[1].toNumber()
                  return next(null, {id, owner, price})
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
            let _data = tokens.map(t => {
              let id = t.id
              return Object.assign(tool.fromIdToGoogle(id), {id})
            });
            let _d = {tokens: _data, address}
            if(_data.length > 0) {
              _d.has = true
            }
            return res.render('mytokens', _d);
          }
        }
      )
    }
  });
});

router.get('/reproduce/:id', (req, res) => {
  let _id = req.params.id
  let tool = req.app.get('tool')

  if(tool.isValidId(_id)) {
    let data = {
      id: _id
    }

    data = Object.assign(data, tool.fromIdToGoogle(_id))
    return res.render('reproduce', data)
  } else {
    return res.send(`${_id} is invalid`)
  }
  
})

router.get('/sell/:id', (req, res) => {
  let _id = req.params.id
  let tool = req.app.get('tool')

  if(tool.isValidId(_id)) {
    let data = {
      id: _id
    }

    data = Object.assign(data, tool.fromIdToGoogle(_id))
    return res.render('sell', data)
  } else {
    return res.send(`${_id} is invalid`)
  }
  
})

router.get('/admin', (req, res) => {
  return res.render('admin', data.getAllData())
});

module.exports = router;
