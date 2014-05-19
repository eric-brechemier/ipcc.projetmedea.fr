within("projetmedea.fr", function(publish, subscribe, get) {
  var
    forEach = this.forEach,
    no = this.no,

    AUTHOR_CONTRIBUTIONS = this.AUTHOR_CONTRIBUTIONS ,
    CONTRIBUTION_CODE_FILTERS = this.CONTRIBUTION_CODE_FILTERS ,
    TOTAL_CONTRIBUTIONS_FILTER = this.TOTAL_CONTRIBUTIONS_FILTER,
    WILDCARD_FILTER = this.WILDCARD_FILTER,
    CAPTURE_WILDCARD_FILTER = this.CAPTURE_WILDCARD_FILTER,
    FILTER_SEPARATOR = this.FILTER_SEPARATOR,
    FILTER_START = this.FILTER_START,
    FILTER_END = this.FILTER_END;

  // For given author, find all the values which would match if they
  // were selected with other active filters kept unchanged, and count
  // the number of matching chapter contributions for all these values.
  function predictTotalMatchingContributions(author, relaxedFilterRegExp) {
    var
      // map of filter value -> total contributions
      //                        matching active filters + this value
      filterValues = {},

    // index of the group captured for the filter value
    // in a relaxed filter regular expression
    CAPTURED_FILTER_VALUE = 1,

    // index of the group captured for the contribution multiplier
    // in a relaxed filter regular expression
    CAPTURED_MULTIPLIER = 2;

    forEach(contributions, function(contribution) {
      var
        match = relaxedFilterRegExp.exec(contribution),
        value,
        count;

      if ( no(match) ) {
        return;
      }

      value = Number( match[CAPTURED_FILTER_VALUE] );
      count = Number( match[CAPTURED_MULTIPLIER] );

      if ( !filterValues.hasOwnProperty(value) ) {
        filterValues[value] = count;
      } else {
        filterValues[value] += count;
      }
    });

    return filterValues;
  }

  // a relaxed filter expression matches all active filters except given one,
  // and captures the filter value and multiplier for matching contributions
  function getRelaxedFilterExpression(relaxedFilterName) {
    var
      activeFilterSet = get("active-filter-set"),
      filterExpression = FILTER_START;

    forEach(CONTRIBUTION_CODE_FILTERS, function(filterName) {
      var activeFilter;
      if ( filterName === relaxedFilterName ) {
        filterExpression += CAPTURE_WILDCARD_FILTER;
      } else {
        activeFilter = activeFilterSet[filterName];
        if ( no(activeFilter) ) {
          filterExpression += WILDCARD_FILTER;
        } else {
          filterExpression += activeFilter.value;
        }
      }
      filterExpression += FILTER_SEPARATOR;
    });

    filterExpression += FILTER_END;
    return new RegExp(filterExpression);
  }

  // Prepare predictive filters: for each filter in turn,
  // combine all other filters and create a function which predicts
  // which values of this filter may be selected for an author to match,]
  // all other filters being left unchanged
  function preparePredictiveFilters(activeFilterList) {
    // TODO: publish "predictive-filters",
    // an array of functions which take an author as argument
    // and return an object with one property named after each filter,
    // with the list of values matching when applied on top of active filters,
    // or for the TOTAL_CONTRIBUTIONS filter, the minimum number which
    // may be selected for an author to match, or null if no such value exists.
  }

  subscribe("active-filter-list", preparePredictiveFilters);
});
