const readline = require("readline");
const fs = require("fs")
const path = require("path")


let tokens = []
let cities = {}
let tokensByCity = {}
let levels = {
  1: "Level-Huge",
  2: 'Level-Large',
  3: 'Level-Middle',
  4: 'Level-Small'
}

let levelSs = {
  1: 'Level-H',
  2: 'Level-L',
  3: 'Level-M',
  4: 'Level-S'
}

let levelSsr = {
  4: 'Level-Small',
  3: 'Level-Middle',
  2: 'Level-Large',
  1: 'Level-Huge'
}

let levelShort = {
  4: 'S',
  3: 'M',
  2: 'L',
  1: 'H'
}

let repeated = {}
let files = ['newyork','seoul','Tokyo', 'hongkong']
files.forEach(t => {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, `../public/assets/data/${t}.csv`))
  })

  rl.on('line', (line) => {
    let _dat = line.split(',')
    try{
        let lv = parseInt(_dat[2])
        let lat = parseFloat(_dat[0]).toFixed(lv)
        let lon = parseFloat(_dat[1]).toFixed(lv)
        

        if (repeated.hasOwnProperty(`${lat}-${lon}-${lv}`)) {
          return
        } else {
          repeated[`${lat}-${lon}-${lv}`] = true
        }
        /*
        if (lv === 0) {
          return
        }*/
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
  })
})


let sorted = false
exports.getData = () => {
  if(!sorted) {
    tokens.sort(() => Math.random() - 0.5)
    sorted = true
  }
  return {cities, tokens: tokens.slice(0, 8), levels};
}

exports.getAllData = () => {
  return {cities, tokens: tokens, levels};
}

exports.getCityData = (city) => {
  return {cities, tokens: tokensByCity[city], levels}
}

exports.levels = levels
exports.levelSs = levelSs
exports.levelSsr = levelSsr
exports.levelShort = levelShort