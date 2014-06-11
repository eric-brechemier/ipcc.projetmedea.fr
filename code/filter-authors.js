within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    or = this.or,
    forEach = this.forEach,
    forEachProperty = this.forEachProperty,
    incrementProperty = this.incrementProperty,
    alwaysTrue = this.alwaysTrue,
    preventFormSubmission = this.preventFormSubmission,
    getTotalAuthorsInCategory = this.getTotalAuthorsInCategory,

    AUTHOR_ID = this.AUTHOR_ID,
    CATEGORY_NAME = this.CATEGORY_NAME,
    CATEGORY_AUTHORS = this.CATEGORY_AUTHORS;

  function applyFilters() {
    var
      isAuthorSelected = get("active-filter-selector"),
      activeFilterList = get("active-filter-list"),
      totalAuthorsByFilter = get("predictive-filters-root"),
      getPredictiveFilters = get("predictive-filter-function"),
      authors = get("authors"),
      selected = [],
      selectedFlags = {};

    if ( activeFilterList.length === 0 ) {
      // shortcut: select all authors
      publish("selected-authors", authors);
      publish("selected-authors-prediction", getTotalAuthorsInCategory);
      publish("selected-author-check", alwaysTrue);
      return;
    }

    forEach(authors, function(record, position){
      var
        authorId = record[AUTHOR_ID],
        predictiveFilters;

      if ( position === 0 ) {
        selected.push(record); // always keep header
        return;
      }

      if ( isAuthorSelected(record) ) {
        selected.push(record);
        selectedFlags[authorId] = true;
      }

      predictiveFilters = getPredictiveFilters(record);
      forEachProperty(predictiveFilters, function(filterValues, filterName) {
        var totalAuthorsByValue = totalAuthorsByFilter[filterName];
        forEach(filterValues, function(filterValue) {
          incrementProperty( totalAuthorsByValue, filterValue );
        });
      });
    });

    publish("selected-authors", selected);
    publish("selected-authors-prediction", function(
      category, filterName, filterValue
    ) {
      return or(totalAuthorsByFilter[filterName][filterValue], 0);
    });
    publish("selected-author-check", function(authorId){
      return selectedFlags[authorId] === true;
    });
  }

  preventFormSubmission(
    document.getElementById("filters")
  );

  subscribe("authors", function(){
    subscribe("active-and-predictive-filters-ready", applyFilters);
  });
});
