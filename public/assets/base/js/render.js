

// let web3;
/*
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
          let price = results[1].toNumber() < floor ? floor : results[1].toNumber();
          $(ele).text(`${web3.fromWei(price)} ETH`);
        })
      });
    }
  })  
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

function render() {
  $('#grid-container [name="price"]').each((i, ele) => {
    let id = ele.getAttribute('e-id')
    ether.getPriceWithFloor(id)
    .then(price => {
      price = parseFloat(price).toFixed(3)
      $(ele).text(`${price} ETH`)
    })
  });
  
  $('#grid-container [name="reproducible"]').each((i, ele) => {
    let id = ele.getAttribute('e-id')
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
              $(ele).text(`cooldown: ${_remain} seconds`)
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
          $(ele).text('View')
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
/*
$.get("/assets/tpl/token.hbs", data => {
  let tpl = Handlebars.compile(data);
  $.get("/assets/data/listTokens.json", (tokens) => {
    $("#grid-container").html(tpl(tokens));
  })
});*/



// renderPage();