within("projetmedea.fr", function(){

  var
    forEach = this.forEach;

  // Count actual records (without header) in given list
  function countData(records){
    return records.length - 1; // do not count header record
  }

  // Loop over data records, skipping the header row
  function forEachData(records,callback){
    forEach(records, function(record,recordPosition){
      if ( recordPosition === 0 ) {
        return; // skip header row
      }
      return callback(record, recordPosition);
    });
  }

  // TODO: rename to printRecords to disambiguate
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
          case 'number':
            csv += field;
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
  this.forEachData = forEachData;
  // TODO: rename to printRecords to disambiguate
  this.printData = printData;
});
