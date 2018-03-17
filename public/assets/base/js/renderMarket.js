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
        $(ele).text('Reproducible')
      } else {
        $(ele).text('Unreproducible');
      }
    })
  });

  $('#grid-container [name="action"]').each((i, ele) => {
    let id = ele.getAttribute('e-id');
    ether.stage(id)
    .then(result => {
      $(ele).text(result)
    })
  });
}

render();

// renderPage();