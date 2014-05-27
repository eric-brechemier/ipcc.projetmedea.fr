within("projetmedea.fr", function(publish, subscribe, get, set) {
  var
    no = this.no,
    countData = this.countData,
    forEachProperty = this.forEachProperty,

    // map of filter name -> filter object for active filters
    // (filters which accept all authors are considered inactive)
    activeFilterSet = {};

  // Check whether a filter is active
  // (filters which accept all authors are considered inactive)
  function isFilterActive(filter) {
    var
      totalAuthors = get('total-authors'),
      filterAuthors = filter.authors;
    if (
      no(filterAuthors) ||
      filterAuthors.length === totalAuthors
    ) {
      return false;
    }
    return true;
  }

  // Check whether a filter is already present in the set of active filters
  function isFilterPresent(filter) {
    return !no(activeFilterSet[filter.name])
  }

  function addFilter(filter) {
    var isNewFilter = !isFilterPresent(filter);
    activeFilterSet[filter.name] = filter;

    if (isNewFilter) {
      publish("active-filter-created", filter);
    } else {
      publish("active-filter-updated", filter);
    }
  }

  function deleteFilter(filter) {
    if ( !isFilterPresent(filter) ) {
      return;
    }

    delete activeFilterSet[filter.name];
    publish("active-filter-deleted", filter);
  }

  // Convert the set of active filters to a list,
  // sorted by ascending number or matching authors
  function getActiveFilterList() {
    var activeFilters = [];
    forEachProperty(activeFilterSet, function(activeFilter) {
      activeFilters.push(activeFilter);
    });
    activeFilters.sort(function(activeFilterA, activeFilterB) {
      return activeFilterA.authors.length - activeFilterB.authors.length;
    });
    return activeFilters;
  }

  function publishFilters() {
    publish("active-filter-set", activeFilterSet);
    publish("active-filter-list", getActiveFilterList(activeFilterSet) );
  }

  function whenNewFilterSelected(filter) {
    if ( isFilterActive(filter) ) {
      addFilter(filter);
    } else {
      deleteFilter(filter);
    }

    publishFilters();
  }

  function whenAllFiltersAreReset() {
    forEachProperty( activeFilterSet, function( activeFilter ) {
      deleteFilter( activeFilter );
    });

    publishFilters();
  }

  subscribe("total-authors", function(){
    // select all authors initially
    publishFilters();
    subscribe("filter-selected", whenNewFilterSelected);
    subscribe("reset-filters", whenAllFiltersAreReset);
  });
});
