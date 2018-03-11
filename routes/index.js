var express = require('express');
var router = express.Router();

var data = require("../public/assets/data/listTokens.json");

router.get("/", (req, res) => {
  return res.render('index', data);
})

router.get("/details/:id", (req, res) => {
  let tool = req.app.get("tool");
  let id = parseInt(req.params['id']);
  let data = tool.fromIdToLonLat(id);
  return res.render('details', {
    id: req.params['id'],
    data
  });
})

module.exports = router;
