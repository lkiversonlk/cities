function Tool(maxLv) {
  var self = this;
  if(!(maxLv >= 0 && maxLv < 100)) {
    throw `map level ${lv} invalid`
  }
  self.maxLv = maxLv;

  self.maxLon = Math.pow(10, maxLv) * 360;
  self.maxLat = Math.pow(10, maxLv) * 180;
  self.latOffset = Math.pow(10, (2 + 3 + maxLv));
  self.lonOffset = Math.pow(10, 2);
  self.float = Math.pow(10, maxLv);

  self.fromIdToLonLat = function(id) {
    let lv = id % self.lonOffset;
    if(lv >= self.maxLv) {
      throw { err: `lv ${lv} is invalid` }
    }
    let lon = (Math.floor(id % self.latOffset / self.lonOffset) / self.float).toFixed(lv + 1);
    let lat = (Math.floor(id / self.latOffset) / self.float).toFixed(lv + 1);
    lv = lv + 1;
    return {lv, lat, lon};
  }

  self.fromLonLatToId = function(_lat, _lon, _lv) {
    let lon = Math.floor(_lon * self.float) * self.lonOffset;
    let lat = Math.floor(_lat * self.float) * self.latOffset;
    return lon + lat + _lv - 1;
  }

  self.fromGooleToLonLat = function(_lat, _lon, _lv) {
    let lon = (parseFloat(_lon) + 180).toFixed(_lv);
    let lat = (90 - parseFloat(_lat)).toFixed(_lv);
    return {lat, lon, lv: _lv};
  }

  self.fromLatLonToGoogle = function(_lat, _lon, _lv) {
    let lon = (_lon - 180).toFixed(_lv);
    let lat = (90 - _lat).toFixed(_lv);
    return {lat, lon, lv: _lv};
  }

  self.fromIdToGoogle = function(id) {
    let {lv, lat, lon} = self.fromIdToLonLat(id);
    return self.fromLatLonToGoogle(lat, lon, lv);
  }

  self.fromGoogleToId = function(_lat, _lon, _lv) {
    let {lat, lon, lv} = self.fromGooleToLonLat(_lat, _lon, _lv);
    return self.fromLonLatToId(lat, lon, lv);
  }

  self.isValidId = function(_id) {
    if(typeof _id === 'string') {
      _id = parseInt(_id)
    }
    
    let lv = _id % self.lonOffset
    if(lv >= self.maxLv) {
      return false
    }
    let lon = Math.floor(_id % self.latOffset / self.lonOffset)
    let lonMod = lon % Math.pow(10, (self.maxLv - lv - 1))
    if(lonMod != 0) {
      return false
    }

    let lat = Math.floor(_id / self.latOffset)
    let latMod = lat % Math.pow(10, (self.maxLv - lv - 1))
    if(latMod != 0) {
      return false
    }

    return true
  }

  let lvM = {
    1: 'A-Level',
    2: 'B-Level',
    3: 'C-Level',
    4: 'D-Level'
  }

  self.transLv = (lv) => {
    return lvM[lv]
  }
}

if(typeof module !== 'undefined') {
  module.exports = Tool;
}
