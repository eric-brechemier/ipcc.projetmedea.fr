within("projetmedea.fr", function(publish, subscribe){
  var
    printData = this.printData;

  subscribe("selected-categories", function(selectedCategories){
    document
      .getElementById('selected-categories-csv-output')
      .innerHTML = printData(selectedCategories);
  });
});
