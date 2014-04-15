within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    map = this.map,
    no = this.no,
    or = this.or,
    form = document.getElementById("filters"),

    // offset of the column with author identifier in each author record
    AUTHOR_ID = 0;

  form.onsubmit = function(){
    return false; // prevent submission to server (reloads the page)
  };

  function filter(data, activeFilterList) {
    return data;
  }

  function select(data, isAuthorSelected){
    var
      selected = [],
      selectedFlags = {};

    forEach(data, function(record, position){
      var authorId = record[AUTHOR_ID];
      if ( position === 0 ) {
        selected.push(record); // always keep header
        return;
      }
      if ( isAuthorSelected(record) ) {
        selected.push(record);
        selectedFlags[authorId] = true;
      }
    });
    publish("selected-authors", selected);
    publish("selected-author-flags", selectedFlags);
  }

  function applyFilters() {
    var
      selectorFunction = get("active-filter-selector"),
      activeFilterList = get("active-filter-list"),
      authors = get("authors");

    select(
      filter(authors, activeFilterList),
      selectorFunction
    );
  }

  subscribe("authors", function(authors){
    subscribe("active-filter-selector", applyFilters);
  });

});
