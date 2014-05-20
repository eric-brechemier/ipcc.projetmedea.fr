within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    or = this.or,
    forEach = this.forEach,
    forEachProperty = this.forEachProperty,
    alwaysTrue = this.alwaysTrue,
    preventFormSubmission = this.preventFormSubmission,

    // offset of the column with author identifier in each author record
    AUTHOR_ID = 0,

    CATEGORY_NAME = this.CATEGORY_NAME,

    // offset of the column with the list of authors in a category record
    CATEGORY_AUTHORS = 2;

  function getTotalAuthorsInCategory(category) {
    if ( no(category) ) {
      return 0;
    }
    var authors = category[CATEGORY_AUTHORS];
    return authors.length;
  }

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
          if ( !totalAuthorsByValue.hasOwnProperty(filterValue) ) {
            totalAuthorsByValue[filterValue] = 1;
          } else {
            totalAuthorsByValue[filterValue]++;
          }
        });
      });
    });

    publish("selected-authors", selected);
    publish("selected-authors-prediction", function(category, filterName) {
      var
        filterValue = category[CATEGORY_NAME],
        totalAuthors = totalAuthorsByFilter[filterName][filterValue];
      return or(totalAuthors, 0);
    });
    publish("selected-author-check", function(authorId){
      return selectedFlags[authorId] === true;
    });
  }

  preventFormSubmission(
    document.getElementById("filters")
  );

  subscribe("authors", function(authors){
    subscribe("active-and-predictive-filters-ready", applyFilters);
  });

});
