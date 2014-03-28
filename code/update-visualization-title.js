within("projetmedea.fr", function(publish, subscribe){

  function updateTitle(title){
    document
      .getElementById("visualization-title")
      .innerHTML = title;
  }

  subscribe("visualization-title", updateTitle);

});
