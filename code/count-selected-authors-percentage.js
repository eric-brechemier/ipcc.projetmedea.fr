within("projetmedea.fr", function(publish, subscribe){

  var
    total = null,
    selected = null,
    display = document.getElementById('selected-records-percentage');

  // Count actual records (without header) in given list
  function count(data){
    return data.length - 1; // do not count header record
  }

  // Compute the percentage that the part represents in the whole
  function percentage(part, whole){
    var percents = part / whole * 100;
    if ( percents < 1 ){
      // round to .01%
      return Math.round(percents * 100) / 100;
    } else {
      return Math.round(percents);
    }
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
