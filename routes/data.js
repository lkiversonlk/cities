const readline = require("readline");
const fs = require("fs")
const path = require("path")
const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, "../public/assets/data/tokens.csv"))
})

let tokens = []
let cities = {}

let tokensByCity = {}

let levels = {
  2: 'Level-Large',
  3: 'Level-Middel',
  4: 'Level-Small'
}

rl.on('line', (line) => {
  let _dat = line.split(',')
  if(_dat.length == 5) {
    try{
      let lat = parseFloat(_dat[0]).toFixed(4)
      let lon = parseFloat(_dat[1]).toFixed(4)
      let lv = parseInt(_dat[2])
      if (lv === 0) {
        return
      }
      let city = _dat[3].trim()
      let cityName = _dat[4].trim()
      if(city.length > 0) {
        cities[city] = cityName
        tokens.push({lat, lon, lv, city, cityName})

        if (!tokensByCity[city]) {
          tokensByCity[city] = []
        }
        tokensByCity[city].push({lat, lon, lv, city, cityName})
      }
    } catch(e) {
      console.log(e)
    }
  }
})

exports.getData = () => {
  return {cities, tokens, levels};
}

exports.getCityData = (city) => {
  return {cities, tokens: tokensByCity[city], levels}
}

exports.levels = levels