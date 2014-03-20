within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    map = this.map,
    no = this.no,
    or = this.or,
    form = document.getElementById('data-filters'),
    fieldNames = [],
    fieldPositions = {},
    OPERATORS = {};

  OPERATORS.EQUALS = function(actualValue, expectedValue){
    return expectedValue === actualValue;
  };

  OPERATORS['LOWER-THAN-OR-EQUAL-TO'] = function(actualValue, expectedValue){
    return actualValue <= expectedValue;
  };

  OPERATORS['GREATER-THAN-OR-EQUAL-TO'] = function(actualValue, expectedValue){
    return actualValue >= expectedValue;
  };

  OPERATORS.CONTAINS = function(actualValues, expectedValue){
    var isFound = forEach(actualValues, function(actualValue){
      return actualValue === expectedValue;
    });
    return isFound;
  };

  function initFieldPositions(){
    forEach(fieldNames, function(fieldName, fieldPosition){
      fieldPositions[fieldName] = fieldPosition;
    });
  }

  // Get the offset of a field
  function getFieldPosition(name){
    return fieldPositions[name];
  }

  function applyFilters(){
    var
      FILTER_PREFIX = 'filter-',
      filters = [];
    forEach(fieldNames, function(fieldName){
      var input = form[FILTER_PREFIX+fieldName];
      if ( !no(input) && !no(input.nodeType) && input.value !== '' ){
        filters.push({
          name: fieldName,
          value: input.value,
          operator: or( input.getAttribute('data-operator'), 'EQUALS')
        });
      }
    });
    publish("filters", filters);
  }

  function getOperators(filters){
    return map(filters, function(filter){
      return OPERATORS[ filter.operator ];
    });
  }

  function filter(data, filters){
    if ( filters.length === 0 ){
      return data; // no filter applied
    }

    var
      selected = [],
      operators = getOperators(filters);

    forEach(data, function(record, position){
      if ( position === 0 ) {
        selected.push(record); // always keep header
        return;
      }
      var isRejected = forEach(filters, function(filter, f){
        return !operators[f](
          record[getFieldPosition(filter.name)],
          filter.value
        );
      });
      if ( !isRejected ) {
        selected.push(record);
      }
    });
    return selected;
  }

  form.onsubmit = function(){
    applyFilters();
    return false; // prevent submission to server (reloads the page)
  };

  // publish initial data (no filter applied)
  subscribe("authors", function(data){
    fieldNames = data[0];
    initFieldPositions();
    applyFilters();
  });

  subscribe("filters", function(filters){
    var data = get('authors');
    publish("filtered-data", filter(data,filters) );
  });
});
