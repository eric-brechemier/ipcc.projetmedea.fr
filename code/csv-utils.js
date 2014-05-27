within("projetmedea.fr", function(){

  var
    forEach = this.forEach,
    reduce = this.reduce,
    or = this.or,

    // offset of the record id or name (first position)
    RECORD_NAME = 0;

  // Count actual records (without header) in given list
  function countData(records){
    return records.length - 1; // do not count header record
  }

  // Loop over data records, skipping the header row
  // The offset 0 corresponds to the first data record in callback.
  function forEachData(records,callback){
    forEach(records, function(record,recordPosition){
      if ( recordPosition === 0 ) {
        return; // skip header row
      }
      return callback(record, recordPosition - 1);
    });
  }

  // Reduce data records to a single value, skipping the header row
  function reduceData( accumulator, records, operation ) {
    return reduce(
      accumulator,
      records,
      function( accumulator, record, recordPosition ) {
        if ( recordPosition === 0 ) {
          return accumulator; // skip header row
        }
        return operation( accumulator, record, recordPosition );
      }
    );
  }

  // Collect the results of applying given function to each data record,
  // skipping the header row
  //
  // The operation is called with the record name (first column)
  // followed with the full record and the offset as parameters.
  function mapData( records, operation ) {
    var result = Array( countData(records) );

    forEachData( records, function( record, i ) {
      var name = record[ RECORD_NAME ];
      result[ i ] = operation( name, record, i );
    });

    return result;
  }

  // Read a column of data, without header, into a new array
  // (the offset for the column is 0-based)
  function getDataColumn(records, columnOffset) {
    var column = Array( countData(records) );
    forEachData(records, function(record, recordOffset) {
      column[recordOffset] = record[columnOffset];
    });
    return column;
  }

  // Store each record in a property named after the value of given column
  // (which defaults to the first column, at offset 0)
  function getDataSet(records, nameColumnOffset) {
    nameColumnOffset = or(nameColumnOffset, RECORD_NAME);
    var set = {};
    forEachData(records, function(record) {
      var name = record[nameColumnOffset];
      set[name] = record;
    });
    return set;
  }

  // Print records as a string in CSV format
  function printRecords(records) {
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
  this.mapData = mapData;
  this.reduceData = reduceData;
  this.getDataColumn = getDataColumn;
  this.getDataSet = getDataSet;
  this.printRecords = printRecords;
});
