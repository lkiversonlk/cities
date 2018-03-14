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