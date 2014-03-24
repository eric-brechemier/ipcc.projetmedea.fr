within("projetmedea.fr", function(publish, subscribe){

  subscribe("svg-rendered", function(svg){
    document
      .getElementById("svg-output")
      .innerHTML = svg.replace('<','&lt;',"g");
  });

});
