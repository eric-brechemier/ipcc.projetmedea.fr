within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    no = this.no,
    form = document.getElementById('data-filters'),
    fieldNames = [],
    fieldPositions = {};

  function initFieldPositions(){
    forEach(fieldNames, function(fieldName, fieldPosition){
      fieldPositions[fieldName] = fieldPosition;
    });
  }

  // Get the offset of a field
  function getFieldPosition(name){
    return fieldPositions[name];
  }

  function collectFilters(){
    var
      FILTER_PREFIX = 'filter-',
      filters = [];
    forEach(fieldNames, function(fieldName){
      var input = form[FILTER_PREFIX+fieldName];
      if ( !no(input) && !no(input.nodeType) && input.value !== '' ){
        filters.push({name: fieldName, value: input.value});
      }
    });
    publish("filters", filters);
  }

  function filter(data, filters){
    if ( filters.length === 0 ){
      return data; // no filter applied
    }

    var selected = [];
    forEach(data, function(record, position){
      if ( position === 0 ) {
        selected.push(record); // always keep header
        return;
      }
      var isRejected = forEach(filters, function(filter){
        return record[getFieldPosition(filter.name)] !== filter.value;
      });
      if ( !isRejected ) {
        selected.push(record);
      }
    });
    return selected;
  }

  form.onsubmit = function(){
    collectFilters();
    return false; // prevent submission to server (reloads the page)
  };

  // publish initial data (no filter applied)
  subscribe("data", function(data){
    fieldNames = data[0];
    initFieldPositions();
    publish("filtered-data", data);
  });

  subscribe("filters", function(filters){
    var data = get('data');
    publish("filtered-data", filter(data,filters) );
  });
});
