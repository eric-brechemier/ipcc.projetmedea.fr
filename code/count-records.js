within("projetmedea.fr", function(publish, subscribe){

  subscribe("data", function(data){
    document
      .getElementById('total-records-count')
      .innerHTML = data.length - 1; // do not count header row
  });
});
