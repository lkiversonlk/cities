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
.then(ins => {
  ins.bidFloor((err, floor) => {
    if(err) {
      //
    } else {
      $('#grid-container [name="price"]').each((i, ele) => {
        let id = ele.getAttribute('e-id');
        //console.log(id);
        ins.positions(id, (err, results) => {
          console.log(err);
          console.log(results);
          let price = results[2].toNumber() < floor ? floor : results[2].toNumber();
          $(ele).text(`${web3.fromWei(price)} ETH`);
        })
      });
    }
  })  
})
.catch(err => {
  alert(err);
})
*/

/**
 * let errors = [
      "WEB3MISS",
      "SYSTEMERR",
      "NOACCOUNT",
      "UNKNOWNNETWORK",
      "NETWORKNOTSUPPORTED"
    ];
 */

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

function render() {
  $('#grid-container [name="price"]').each((i, ele) => {
    let id = ele.getAttribute('e-id');
    ether.getPriceWithFloor(id)
    .then(price => {
      price = parseFloat(price).toFixed(3)
      $(ele).text(`${price} ETH`);
    })
  });
  
  $('#grid-container [name="reproducible"]').each((i, ele) => {
    let id = ele.getAttribute('e-id');
    ether.reproducable(id)
    .then(result => {
      if(result) {
        //if in cooldown
        ether.inCooldown(id)
        .then(_cooldown => {
          if(_cooldown) {
            $(ele).text('Reproducible')
          } else {
            ether.timeRemain(id)
            .then(_remain => {
              let days = Math.floor(_remain / 24 / 3600)
              let hours = Math.floor(_remain / 3600) % 24
              let minutes = Math.floor(_remain / 60) % 60
              let seconds = _remain % 60 
              $(ele).text(`cooldown: ${days}d:${hours}h:${minutes}m:${seconds}s`)
            })
          }
        })
      } else {
        $(ele).text('Unreproducible');
      }
    })
  });

  $('#grid-container [name="action"]').each((i, ele) => {
    let id = ele.getAttribute('e-id');
    ether.stage(id)
    .then(result => {
      switch(result) {
        case 'Unsold':
        case 'Hold':
          $(ele).text('Info')
          break
        case 'Yours':
        case 'Sell':
          $(ele).text('My')
          break
        case 'Buy':
          $(ele).text('Buy')
          break
      }
      //$(ele).text(result)
    })
  });
}

render();

// renderPage();