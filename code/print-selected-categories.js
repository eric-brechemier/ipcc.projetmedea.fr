within("projetmedea.fr", function(publish, subscribe){
  var
    printRecords = this.printRecords;

  subscribe("selected-categories", function(selectedCategories){
    document
      .getElementById('selected-categories-csv-output')
      .innerHTML = printRecords(selectedCategories);
  });
});
