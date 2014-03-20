within("projetmedea.fr", function(publish, subscribe){
  var
    printData = this.printData;

  subscribe("selected-authors", function(selectedAuthors){
    document
      .getElementById("selected-authors-csv-output")
      .innerHTML = printData(selectedAuthors);
  });
});
