within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    or = this.or,
    forEach = this.forEach,
    forEachProperty = this.forEachProperty,
    alwaysTrue = this.alwaysTrue,
    preventFormSubmission = this.preventFormSubmission,

    AUTHOR_ID = this.AUTHOR_ID,
    ANY_VALUE = this.LIST_ITEM_DEFAULT_VALUE,
    CATEGORY_NAME = this.CATEGORY_NAME,
    CATEGORY_AUTHORS = this.CATEGORY_AUTHORS;

  // TODO: use the function defined in filter-utils
  function getTotalAuthorsInCategory(category, filterName, filterValue) {
    if ( filterValue === "" ) {
      return get("total-authors");
    }
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
          // TODO: extract function incrementProperty(object, name)
          if ( !totalAuthorsByValue.hasOwnProperty(filterValue) ) {
            totalAuthorsByValue[filterValue] = 1;
          } else {
            totalAuthorsByValue[filterValue]++;
          }
        });
        if ( filterValues.length > 0 ) {
          // TODO: extract function incrementProperty(object, name)
          if ( !totalAuthorsByValue.hasOwnProperty(ANY_VALUE) ) {
            totalAuthorsByValue[ANY_VALUE] = 1;
          } else {
            totalAuthorsByValue[ANY_VALUE]++;
          }
        }
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

  subscribe("authors", function(authors){
    subscribe("active-and-predictive-filters-ready", applyFilters);
  });

});
