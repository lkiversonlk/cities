let url = window.location.href;

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
    $('#earned').each((i, ele) => {
        // $(ele).val('asdfasdfasdf')
        let addr = ele.getAttribute('e-id')
        ether.getEarned()
        .then(amount => {
            $(ele).val(`${amount}ETH`)
        })

        $("#withdraw").click(() => {
            ether.withdraw();
            return false;
        })
    })
}

render();