within("projetmedea.fr", function(publish, subscribe){

  // publish initial data (no filter applied)
  subscribe("data", function(data){
    publish("filtered-data", data);
  });
});
