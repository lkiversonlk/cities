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
  ether.getPriceWithFloor(id)
  .then(price => {
    $(ele).text(`${price} ETH`);
  })

  id = parseInt(id)
  ether.stage(id)
  .then((_state) => {
    switch(_state) {
      case 'Unsold':
      //do nothing
      break;
      case 'Yours':
      $("#sell").show()
      break;
      case 'Sell':
      $("#unsell").show()
      break;
      case 'Buy':
      $('#buy').show()
      break;
      case 'Hold':
      break;
    }

    ether.reproducable(id)
    .then(_reproducable => {
      if(_reproducable) {
        if(_state === 'Yours' || _state === 'Sell') {
          $("#reproduce").show()
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

  $("#sell").click(() => {
    ether.sellToken(id)
    .then(tx => {
      console.log(tx)
    })
  })

  $("#reproduce").click(() => {
    ether.reproduce(id)
    .then(tx => {
      console.log(tx)
    })
  })
}





// renderPage();