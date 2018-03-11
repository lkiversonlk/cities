function Tool(lv) {
  var self = this;
  if(!(lv >= 0 && lv < 100)) {
    throw `map level ${lv} invalid`
  }  

  self.maxLon = Math.pow(10, (lv - 1)) * 360;
  self.maxLat = Math.pow(10, (lv - 1)) * 180;
  self.latOffset = Math.pow(10, 2);
  self.lonOffset = Math.pow(10, (2 + 3 + lv - 1));
  self.float = Math.pow(10, (lv - 1));

  self.fromIdToLonLat = function(id) {
    let lv = id % self.latOffset;
    let lat = Math.floor(id % self.lonOffset / self.latOffset) / self.float;
    let lon = Math.floor(id / self.lonOffset) / self.float;

    return {lv, lat, lon};
  }

  self.fromLonLatToId = function(lat, lon, lv) {
    let _lon = Math.floor(lon * self.float) * self.lonOffset;
    let _lat = Math.floor(lat * self.float) * self.latOffset;
    return _lon + _lat + lv;
  }
}

if(typeof module !== 'undefined') {
  module.exports = Tool;
}
