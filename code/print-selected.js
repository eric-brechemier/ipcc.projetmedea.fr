within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,
    output = document.getElementById("data-output");

  function printData(records) {
    var
      csv = "",
      lastRecord = records.length - 1;

    forEach(records, function(record, recordPosition){
      var lastField = record.length - 1;
      forEach(record, function(field, fieldPosition){
        csv += '"' + field.replace('"','""') + '"';
        if (fieldPosition < lastField) {
          csv += ',';
        }
      });
      if (recordPosition < lastRecord) {
        csv += '\n';
      }
    });

    output.innerHTML = csv;
  }

  subscribe("filtered-data", printData);
});
