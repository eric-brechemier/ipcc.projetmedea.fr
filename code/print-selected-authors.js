within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,
    output = document.getElementById("selected-authors-csv-output");

  function printData(records) {
    var
      csv = "",
      lastRecord = records.length - 1;

    forEach(records, function(record, recordPosition){
      var
        lastField = record.length - 1,
        lastItem;
      forEach(record, function(field, fieldPosition){
        if ( typeof field === 'string' ) {
          csv += '"' + field.replace('"','""') + '"';
        } else { // array
          lastItem = field.length - 1;
          csv += '[';
          forEach(field, function(item, itemPosition){
            csv += item;
            if ( itemPosition < lastItem ) {
              csv += '|';
            }
          });
          csv += ']';
        }
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

  subscribe("selected-authors", printData);
});
