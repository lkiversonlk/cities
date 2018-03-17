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

let ele = $('#reproduce-cost')[0]

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
  })
}





// renderPage();