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
      let ele = $('span[name="price"')[0];
      let id = ele.getAttribute('e-id');
      ins.positions(id, (err, results) => {
        let price = results[2].toNumber() < floor ? floor : results[2].toNumber();
        $(ele).text(`${web3.fromWei(price)} ETH`);
      })
    }
  })


})
.catch(err => {
  alert(err);
})






// renderPage();