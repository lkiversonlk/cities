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

router.get("/marketplace", (req, res) => {
  return res.render('marketplace', data.getData())
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
            return res.render('mytokens', {tokens: _data});
          }
        }
      )
    }
  });
});

router.get('/admin', (req, res) => {
  return res.render('admin', data.getData())
});

module.exports = router;
