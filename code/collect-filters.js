within("projetmedea.fr", function(publish, subscribe, get, set) {
  var
    no = this.no,
    countData = this.countData,
    forEachProperty = this.forEachProperty,

    // map of filter name -> filter object for active filters
    // (filters which accept all authors are considered inactive)
    filterSet = {},

    // total number of authors,
    // initially null until author records are loaded
    totalAuthors = null;

  // Check whether a filter is active
  // (filters which accept all authors are considered inactive)
  function isFilterActive(filter) {
    var filterAuthors = filter.authors;
    if (
      no(filterAuthors) ||
      filterAuthors.length === totalAuthors
    ) {
      return false;
    }
    return true;
  }

  // Check whether a filter is already present in the set
  function isFilterPresent(filter) {
    return !no(filterSet[filter.name])
  }

  function addFilter(filter) {
    var isNewFilter = !isFilterPresent(filter);
    filterSet[filter.name] = filter;

    if ( no(totalAuthors) ) {
      // do not publish filters before total authors is available
      // to identify inactive filters
      return;
    }

    if (isNewFilter) {
      publish("filter-created", filter);
    } else {
      publish("filter-updated", filter);
    }
  }

  function deleteFilter(filter) {
    if ( !isFilterPresent(filter) ) {
      return;
    }

    delete filterSet[filter.name];

    if ( no(totalAuthors) ) {
      // do not publish filters before total authors is available
      // to identify inactive filters
      return;
    }

    publish("filter-deleted", filter);
  }

  // Convert the set of filters to a list,
  // sorted by ascending number or matching authors
  function getFilterList() {
    var filters = [];
    forEachProperty(filterSet, function(filter) {
      filters.push(filter);
    });
    filters.sort(function(filterA, filterB) {
      return filterA.authors.length - filterB.authors.length;
    });
    return filters;
  }

  function publishFilters() {
    if ( no(totalAuthors) ) {
      // do not publish filters before total authors is available
      // to identify inactive filters
      return;
    }

    publish("filter-list", getFilterList(filterSet) );
  }

  function whenNewFilterSelected(filter) {
    if ( isFilterActive(filter) ) {
      addFilter(filter);
    } else {
      deleteFilter(filter);
    }

    publishFilters();
  }

  function publishInitialFilters(authorsData) {
    var initialFilterSet = filterSet;
    filterSet = {};
    totalAuthors = countData(authorsData);
    forEachProperty(initialFilterSet, function(filter) {
      if ( isFilterActive(filter) ) {
        // add filters anew to publish "filter-added" events
        addFilter(filter);
      } else {
        // remove filters that accept all authors,
        // now that the total number of authors is known
        deleteFilter(filter);
      }
    });
  }

  subscribe("authors", publishInitialFilters);
  subscribe("filter-selected", whenNewFilterSelected);
});
