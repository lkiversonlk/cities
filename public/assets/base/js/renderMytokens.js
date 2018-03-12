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