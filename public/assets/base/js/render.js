var renderPage = function() {
  $.get("/assets/tpl/token.hbs", data=>{
    _tpl = Handlebars.compile(data);
    $.get("/assets/data/listTokens.json", data => {
      $("#grid-container").html(
        _tpl(data)
      )
    })
  })
}


let ether = ethereum((err) => {
  alert(err);
})

ether.getContractIns()
.then(ins => {
  $('#grid-container [name="price"]').fo
})
.catch(err => {
  alert(err);
})






// renderPage();