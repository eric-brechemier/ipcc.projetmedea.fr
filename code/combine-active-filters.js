within("projetmedea.fr", function(publish, subscribe) {
  var
    forEach = this.forEach,
    no = this.no,

    // offset of the field with the list of author contribution codes
    // in each author record
    AUTHOR_CONTRIBUTIONS = 3,

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
    WILDCARD_FILTER = "[^\\.]+",

    // character used as separator between filters in the filter expression
    FILTER_SEPARATOR = "\\.",

    // start of the filter expression:
    // anchor the expression to the start of the string
    FILTER_START = "^",

    // end of the filter expression:
    // add the 'x' character before the multiplier,
    // then capture the remaining characters in group 1.
    FILTER_END = "x(.+)$",

    // index of the group captured for the contribution multiplier
    CAPTURED_MULTIPLIER = 1;

  function getTotalMatchingContributions(author, filterRegExp) {
    var
      totalMatchingContributions = 0,
      contributions = author[AUTHOR_CONTRIBUTIONS];

    forEach(contributions, function(contribution) {
      var match = filterRegExp.exec(contribution);
      if ( no(match) ) {
        return;
      }
      totalMatchingContributions += match[CAPTURED_MULTIPLIER];
    });

    return totalMatchingContributions;
  }

  function getSelectorFunction(filterExpression, multiplier) {
    var filterRegExp = new RegExp(filterExpression);
    return function(author) {
      return getTotalMatchingContributions(author, filterRegExp) >= multiplier;
    };
  }

  // combine active filters to compute the concatenated filter expression
  // and the selector function to apply to authors for funnel filtering
  function combineActiveFilters(activeFilterSet) {
    var
      filterExpression = FILTER_START,
      multiplierFilter = activeFilterSet[TOTAL_CONTRIBUTIONS_FILTER],
      multiplier;

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

    if ( no(multiplierFilter) ) {
      multiplier = 1;
    } else {
      multiplier = Number(multiplierFilter.value);
    }

    publish(
      "active-filter-selector",
      getSelectorFunction(filterExpression, multiplier)
    );
  }

  subscribe("active-filter-set", combineActiveFilters);
});
