

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

$('#grid-container [name="price"]').each((i, ele) => {
  let id = ele.getAttribute('e-id');
  ether.getPriceWithFloor(id)
  .then(price => {
    $(ele).text(`${price} ETH`);
  })
});

/*
$.get("/assets/tpl/token.hbs", data => {
  let tpl = Handlebars.compile(data);
  $.get("/assets/data/listTokens.json", (tokens) => {
    $("#grid-container").html(tpl(tokens));
  })
});*/



// renderPage();