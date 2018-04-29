ether
.getWeb3
.then(ethereum =>{
  return ether.config
  .then(() => {
    $('#user').text(`Wallet: ${ethereum.address.slice(0,10)}...`)
  })
})
.catch((err) => {
  switch(err) {
    case 'WEB3MISS':
      $('#login-form').modal('show')
      break
    case 'NOACCOUNT':
      $('#locked-form').modal('show')
      break
    case 'NETWORKNOTSUPPORTED':
      $('#user').text(`wrong network`)
      alert('wrong network')
  }
})


let ele = $('#iLv')[0]
$("#iLv").on('change', function(){
  let lv = this.value;
  console.log(`select ${lv}`)
  ether.regPrice(lv - 1)
  .then(_price => {
    $("#iFee").val(`${_price}ETH`)
  })

  let longitude = parseFloat($("#iLongitude").val())
  longitude = longitude.toFixed(lv)
  $("#iLongitude").val(longitude)

  let latitude = parseFloat($("#iLatitude").val())
  latitude = latitude.toFixed(lv)
  $("#iLatitude").val(latitude)
})

let select = $('#iLv option:first').val();
ether.regPrice(select - 1)
  .then(_price => {
    $("#iFee").val(`${_price}ETH`)
  })


$("#iLongitude").on("change", function() {
  let longitude = parseFloat($("#iLongitude").val())
  let lv = parseInt($("#iLv").val())
  longitude = longitude.toFixed(lv)
  $("#iLongitude").val(longitude)
})

$("#iLatitude").on("change", function() {
  let latitude = parseFloat($("#iLatitude").val())
  let lv = parseInt($("#iLv").val())
  latitude = latitude.toFixed(lv)
  $("#iLatitude").val(latitude)
})

$("#register").click(function(){
  let longitude = parseFloat($("#iLongitude").val())
  let latitude = parseFloat($("#iLatitude").val())
  let lv = parseInt($("#iLv").val())

  longitude = longitude.toFixed(lv)
  latitude = latitude.toFixed(lv)

  if (longitude < -180 || longitude > 180) {
    alert(`invalid longitude ${longitude}`)
    return false
  }

  if (latitude < -90 || latitude > 90) {
    alert(`invalid latitude ${latitude}`)
    return false
  }

  let buy = confirm(`lon: ${longitude}, lat: ${latitude}`)

  if(buy){
    $.get(`/g2i?lon=${longitude}&lat=${latitude}&lv=${lv}`, function(data){
      console.log(`get id ${data}`)
      ether.register(data, lv - 1)
      .catch(err => {
        alert(err)
      })
    })
  }
  return false
})

$("#checkout").click(function(){
  let longitude = parseFloat($("#iLongitude").val())
  let latitude = parseFloat($("#iLatitude").val())
  window.open(`https://www.google.com/maps/place/${latitude},${longitude}`);
  return false
})

/*
if(ele) {
  let id = ele.getAttribute('e-id');

  ether.reproducable(id)
    .then(_reproducable => {
      
      if(_reproducable) {
        $('#reproducable').text(`reproducable`)
      } else {
        $('#reproducable').text(`unreproducable`)
        $("#reproduce").hide()
      }
    })

  ether.reproduceCost(id)
  .then(price => {
    $(ele).val(`${price} ETH`);
  })

  $("#reproduce").click(() => {
    ether.reproduce(id)
    .then(tx => {
      console.log(tx)
    })
    return false
  })
}





// renderPage();*/