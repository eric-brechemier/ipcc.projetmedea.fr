within("projetmedea.fr", function(publish, subscribe){

  var
    percentage = this.percentage,
    total = null,
    selected = null,
    display = document.getElementById('selected-records-percentage');

  // Count actual records (without header) in given list
  function count(data){
    return data.length - 1; // do not count header record
  }

  function update(){
    if (total===null || selected===null) {
      return;
    }
    display.innerHTML = percentage(selected, total);
  }

  subscribe("authors", function(data){
    total = count(data);
    update();
  });

  subscribe("filtered-data", function(data){
    selected = count(data);
    update();
  });
});
