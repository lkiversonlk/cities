let url = window.location.href;

let ether = ethereum((err) => {
  alert(err);
})

if(url.slice(-8).indexOf("tokens") != -1) {

  //redirect
  ether.getWeb3.then(ethereum => {
    let addr = ethereum.address;
    window.location.href = `/mytokens/${addr}`; //relative to domain
  })
}

function render() {
  $('#grid-container [name="price"]').each((i, ele) => {
    let id = ele.getAttribute('e-id');
    ether.getPriceWithFloor(id)
    .then(price => {
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