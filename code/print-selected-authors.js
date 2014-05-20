within("projetmedea.fr", function(publish, subscribe){
  var
    printRecords = this.printRecords;

  subscribe("selected-authors", function(selectedAuthors){
    document
      .getElementById("selected-authors-csv-output")
      .innerHTML = printRecords(selectedAuthors);
  });
});
