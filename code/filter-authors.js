within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    alwaysTrue = this.alwaysTrue,
    form = document.getElementById("filters"),

    // offset of the column with author identifier in each author record
    AUTHOR_ID = 0;

  form.onsubmit = function(){
    return false; // prevent submission to server (reloads the page)
  };

  function filter(data, isAuthorSelected){
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
    publish("selected-author-check", function(authorId){
      return selectedFlags[authorId] === true;
    });
  }

  function applyFilters() {
    var
      selectorFunction = get("active-filter-selector"),
      activeFilterList = get("active-filter-list"),
      authors = get("authors");

    if ( activeFilterList.length === 0 ) {
      // shortcut: select all authors
      publish("selected-authors", authors);
      publish("selected-author-check", alwaysTrue);
      return;
    }

    filter(authors, selectorFunction);
  }

  subscribe("authors", function(authors){
    subscribe("active-filter-selector", applyFilters);
  });

});
