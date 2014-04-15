within("projetmedea.fr", function(){

  var
    forEach = this.forEach,
    or = this.or;

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

  // Read a column of data, without header, into a new array
  // (the offset for the column is 0-based)
  function getDataColumn(records, columnOffset) {
    var column = Array( countData(records) );
    forEachData(records, function(record, recordOffset) {
      column[recordOffset - 1] = record[columnOffset];
    });
    return column;
  }

  // Store each record in a property named after the value of given column
  // (which defaults to the first column, at offset 0)
  function getDataSet(records, nameColumnOffset) {
    nameColumnOffset = or(nameColumnOffset, 0);
    var set = {};
    forEachData(records, function(record) {
      var name = record[nameColumnOffset];
      set[name] = record;
    });
    return set;
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
  this.getDataColumn = getDataColumn;
  this.getDataSet = getDataSet;
  // TODO: rename to printRecords to disambiguate
  this.printData = printData;
});
