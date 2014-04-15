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

  function select(data, isAuthorSelected){
    var
      selected = [],
      selectedFlags = Array(data.length);

    forEach(data, function(record, position){
      var authorId = record[AUTHOR_ID];
      if ( position === 0 ) {
        selected.push(record); // always keep header
        selectedFlags[0] = false;
        return;
      }
      if ( isAuthorSelected(record) ) {
        selected.push(record);
        selectedFlags[authorId] = true;
      } else {
        selectedFlags[authorId] = false;
      }
    });
    publish("selected-authors", selected);
    publish("selected-author-flags", selectedFlags);
  }

  function alwaysTrue() {
    return true;
  }

  subscribe("authors", function(authors){
    // select all authors initially
    select(authors, alwaysTrue);
  });

  subscribe("active-filter-selector", function(selectorFunction){
    var authors = get('authors');
    select(authors, selectorFunction);
  });

});
