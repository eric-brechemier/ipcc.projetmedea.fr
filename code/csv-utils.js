within("projetmedea.fr", function(){

  var
    forEach = this.forEach;

  // Count actual records (without header) in given list
  function countData(records){
    return records.length - 1; // do not count header record
  }

  // Print records as a string in CSV format
  function printData(records) {
    var
      csv = "",
      lastRecord = records.length - 1;

    forEach(records, function(record, recordPosition){
      var
        lastField = record.length - 1,
        lastItem;
      forEach(record, function(field, fieldPosition){
        switch(typeof field){
          case 'string':
            csv += '"' + field.replace('"','""') + '"';
            break;
          default: // array
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

    return csv;
  }

  this.countData = countData;
  this.printData = printData;
});
