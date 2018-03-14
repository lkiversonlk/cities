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
  })
}





// renderPage();