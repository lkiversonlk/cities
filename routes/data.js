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
      if(city.length > 0) {
        cities[city] = cityName
        tokens.push({lat, lon, lv, city, cityName})
      }
    } catch(e) {
      console.log(e)
    }
  }
})

exports.getData = () => {
  return {cities, tokens};
}