within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData;

  subscribe("selected-categories", function(selectedCategories){
    document
      .getElementById('selected-categories-count')
      .innerHTML = count(selectedCategories);
  });

});
