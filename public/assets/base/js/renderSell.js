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


let ele = $('#sell')[0]

if(ele) {
  let id = ele.getAttribute('e-id');

  ether.getContractIns
  .then(ins => {
    return new Promise((resolve, reject) => {
      ins.positions(id, (err, pos) => {
        if(err) {
          reject(err)
        } else {
          resolve(pos[1].toNumber())
        }
      })
    })
  })
  .then(price => {
    return ether.getWeb3
    .then(ethereum => {
      let high = ethereum.web3.fromWei(price * 160 / 100)
      let low = ethereum.web3.fromWei(price)
      $('#high').val(high)
      $('#low').val(low)
    })
  })

  ether.reproducable(id)
  .then(reproducable => {
    if(reproducable) {
      $('[name="reproduce"').text('reproducable')
    } else {
      $('[name="reproduce"').text('unreproducable')
    }
    
  })

  $("#sell").click(() => {
    ether.sellToken(id)
    .then(tx => {
      console.log(tx)
    })
  })
}

