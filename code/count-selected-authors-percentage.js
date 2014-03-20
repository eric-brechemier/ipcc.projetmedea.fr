within("projetmedea.fr", function(publish, subscribe){

  var
    percentage = this.percentage,
    count = this.count,
    total = null,
    selected = null,
    display = document.getElementById('selected-records-percentage');

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

  subscribe("selected-authors", function(data){
    selected = count(data);
    update();
  });
});
