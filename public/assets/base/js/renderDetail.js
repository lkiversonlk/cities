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

  ether.getContractIns
    .then(ins => {
      let ele = $("#buysell div")
      console.log(ins._eth.coinbase);
      ins.ownerOf(id, (err, owner) => {
        if(err) {
          console.log(err);
        } else {
          ins.getStage(id, (err, stage) => {
            console.log(stage);
            let _stage = stage.toNumber();
            if(_stage == 0) {
              
            } else if(_stage == 1) {
              if (owner == ins._eth.coinbase) {
                $("#unsell").show();
              } else {
                $("#buy").show();

                $("#buy").click(() => {
                  ether.buyToken(id, (err, tx) => {
                    console.log(err, tx);
                  })
                })
              }
            } else if(_stage == 2) {
              if (owner == ins._eth.coinbase) {
                $("#sell").show();
              }
            }
          });
        }
      })
      
    })
  
  /*  
  $("#buy").click(() => {
    //alert(`buy ${id}`);
    
  })*/
}





// renderPage();