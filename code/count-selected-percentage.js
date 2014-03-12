within("projetmedea.fr", function(publish, subscribe){

  var total = null;

  subscribe("data", function(data){
    total = data.length - 1; // do not count header record
  });

  subscribe("filtered-data", function(data){
    var selected = data.length - 1; // do not count header row
    document
      .getElementById('selected-records-percentage')
      .innerHTML = Math.round(selected / total * 100);
  });
});
