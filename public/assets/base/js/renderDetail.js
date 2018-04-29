/*
let ether = ethereum((err) => {
  alert(err);
})

let web3;

ether
.getWeb3
.then(_ethereum => {
  web3 = _ethereum.web3;
  return ether;
})
.then(_ether => {
  return _ether.getContractIns;
})
.catch(err => {
  alert(err);
})*/
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

let ele = $('#buysell span[name="price"]')[0];
if(ele) {
  let id = ele.getAttribute('e-id');
  

  id = parseInt(id)
  ether.stage(id)
  .then((_state) => {
    switch(_state) {
      case 'Unsold':
      //do nothing
      $(ele).text(`Not for Sale`)
      break;
      case 'Yours':
      $("#sell").show()
      break;
      case 'Sell':
      $("#unsell").show()
      $("#setPriceBtn").show()
      break;
      case 'Buy':
      $('#buy').show()
      break;
      case 'Hold':
      break;
    }

    if(_state !== 'Unsold') {
      ether.getPriceWithFloor(id)
        .then(price => {
          price = parseFloat(price).toFixed(3)
          $(ele).text(`${price} ETH`)
        })
    }

    if(_state === 'Sell') {
      ether.auctions(id)
      .then(prices => {
        $("#sprice").val(`${prices[0]}`)
        $("#eprice").val(`${prices[1]}`)
      })
    }

    ether.reproducable(id)
    .then(_reproducable => {
      if(_reproducable) {
        if(_state === 'Yours' || _state === 'Sell') {
          ether.inCooldown(id)
          .then(_cooldown => {
            if(_cooldown) {
              //in cool down
              $("#reproduce").show()              
            } else {
            }
          })          
        }
      }
    })
  })

  $('#buy').click(() => {
    ether.buyToken(id)
    .then(tx=>{
      console.log(tx)
    })
  })

  $("#unsell").click(() => {
    ether.cancelAuction(id)
    .then(tx => {
      console.log(tx)
    })
  })

  $("#callSetPrice").click(function(){
    let p = parseFloat($("#sprice").val())

    ether.updatePrice(id, p)
    $("#setPrice").fade()
    return false
  })

  /*
  $("#sell").click(() => {
    ether.sellToken(id)
    .then(tx => {
      console.log(tx)
    })
  })*/

  /*
  $("#reproduce").click(() => {
    ether.reproduce(id)
    .then(tx => {
      console.log(tx)
    })
  })*/
}





// renderPage();