within("projetmedea.fr", function(publish, subscribe){

  var
    form = document.getElementById('data-filters');

  form.onsubmit = function(){
    return false; // prevent submission to server (reloads the page)
  };

  // publish initial data (no filter applied)
  subscribe("data", function(data){
    publish("filtered-data", data);
  });
});
