var express = require('express');
var router = express.Router();

var data = require("../public/assets/data/listTokens.json");

router.get("/", (req, res) => {
  return res.render('index');
})

router.get("/details/:id", (req, res) => {
  let tool = req.app.get("tool");
  let id = parseInt(req.params['id']);
  let data = tool.fromIdToLonLat(id);
  const async = require("async");

  if(data.err) {
    return res.send(`${id} is not valid`)
  } else {
    return res.render('details', {
      id: req.params['id'],
      data
    });
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
  ins.balanceOf(address, (err, len) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      
    }
  });
  ins.owned(address, (err, results) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      results = results.map(n => {return n.toNumber});
      return res.render('mytokens', results);
    }
  })
});

module.exports = router;
