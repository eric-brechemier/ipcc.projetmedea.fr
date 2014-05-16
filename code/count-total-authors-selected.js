within("projetmedea.fr", function(publish, subscribe){

  subscribe("selected-authors", function(data){
    document
      .getElementById('selected-records-count')
      .innerHTML = data.length - 1; // do not count header row
  });
});
