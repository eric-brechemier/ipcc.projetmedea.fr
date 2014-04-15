within("projetmedea.fr", function(publish, subscribe) {
  var
    forEach = this.forEach,
    no = this.no,

    // sequence of the names of filters that make up the contribution code
    CONTRIBUTION_CODE_FILTERS = [
      "assessment-report-categories",
      "working-group-categories",
      "role-categories",
      "institution-categories",
      "country-categories"
    ],

    // name of the filter for the total number of contributions
    // corresponding to the contribution code
    TOTAL_CONTRIBUTIONS_FILTER = "total-contributions-categories",

    // part of the filter expression for a filter that matches any value
    // (matches all characters up to the next filter separator)
    WILDCARD_FILTER = "[^\.]+",

    // character used as separator between filters in the filter expression
    FILTER_SEPARATOR = "\.",

    // start of the filter expression:
    // anchor the expression to the start of the string
    FILTER_START = "^",

    // end of the filter expression:
    // add the 'x' character before the multiplier
    FILTER_END = "x";

  // combine active filters to compute the concatenated filter expression
  // and the selector function to apply to authors for funnel filtering
  function combineActiveFilters(activeFilterSet) {
    var filterExpression = FILTER_START;
    forEach(CONTRIBUTION_CODE_FILTERS, function(filterName) {
      var activeFilter = activeFilterSet[filterName];
      if ( no(activeFilter) ) {
        filterExpression += WILDCARD_FILTER;
      } else {
        filterExpression += activeFilter.value;
      }
      filterExpression += FILTER_SEPARATOR;
    });
    filterExpression += FILTER_END;
    publish("active-filter-expression", filterExpression);
  }

  subscribe("active-filter-set", combineActiveFilters);
});
