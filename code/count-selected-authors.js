within("projetmedea.fr", function(publish, subscribe){

  subscribe("filtered-data", function(data){
    document
      .getElementById('selected-records-count')
      .innerHTML = data.length - 1; // do not count header row
  });
});
