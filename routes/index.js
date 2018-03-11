var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  let data = {
    listTokens: [
      {
        city: 'beijing',
        cityName: 'Bei Jing',
        tokens: [
          {
            lon: 23.3,
            lat: 2311,
            lv: 0
          }
        ]
      },
      {
        city: 'newyork',
        cityName: 'New York',
        tokens: [
          {
            lon: 23.3,
            lat: 2311,
            lv: 0
          }
        ]
      },
      {
        city: 'losangelse',
        cityName: 'Los Angeles',
        tokens: [
          {
            lon: 23.3,
            lat: 2311,
            lv: 0
          }
        ]
      },
      {
        city: 'seoul',
        cityName: 'Seoul',
        tokens: [
          {
            lon: 23.3,
            lat: 2311,
            lv: 0
          }
        ]
      }
    ]
  }
  return res.render('index', data);
})
module.exports = router;
