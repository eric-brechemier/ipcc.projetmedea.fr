within("projetmedea.fr", function(publish, subscribe){

  subscribe("authors", function(data){
    document
      .getElementById('total-records-count')
      .innerHTML = data.length - 1; // do not count header row
  });
});
