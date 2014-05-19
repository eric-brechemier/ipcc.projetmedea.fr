within("projetmedea.fr", function(publish, subscribe, get) {
  var
    forEach = this.forEach,
    no = this.no,
    alwaysTrue = this.alwaysTrue,

    // offset of the field with the list of author contribution codes
    // in each author record
    AUTHOR_CONTRIBUTIONS = 3,

    // sequence of the names of filters
    // that make up the contribution code
    CONTRIBUTION_CODE_FILTERS = [
      "assessment-report-categories",
      "working-group-categories",
      "role-categories",
      "country-categories",
      "institution-type-categories",
      "institution-categories"
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
      totalMatchingContributions += Number(match[CAPTURED_MULTIPLIER]);
    });

    return totalMatchingContributions;
  }

  function getSelectorFunction(filterExpression, multiplier) {
    var filterRegExp = new RegExp(filterExpression);
    return function(author) {
      return getTotalMatchingContributions(author, filterRegExp) >= multiplier;
    };
  }

  function getFilterExpression() {
    var
      activeFilterSet = get("active-filter-set"),
      filterExpression = FILTER_START;

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
    return filterExpression;
  }

  function getMultiplier() {
    var
      activeFilterSet = get("active-filter-set"),
      multiplierFilter = activeFilterSet[TOTAL_CONTRIBUTIONS_FILTER],
      multiplier;

    if ( no(multiplierFilter) ) {
      multiplier = 1;
    } else {
      multiplier = Number(multiplierFilter.value);
    }

    return multiplier;
  }

  // combine active filters to compute the concatenated filter expression
  // and the selector function to apply to authors for funnel filtering
  function combineActiveFilters(activeFilterList) {
    if ( activeFilterList.length === 0 ) {
      // shortcut
      publish("active-filter-selector", alwaysTrue);
      return;
    }

    publish(
      "active-filter-selector",
      getSelectorFunction(getFilterExpression(), getMultiplier())
    );
  }

  // Combine all filters leaving one aside in turn
  // to prepare a predictive function to detect which extra filter value,
  // for a single filter with all other active filters kept unchanged,
  // would allow an author to be selected
  function combinePredictiveFilter(activeFilterList) {
    // TODO: publish "predictive-filter-selector",
    // a function which takes an author as argument
    // and returns an object with one property named after each filter,
    // with the list of values which would match the author
    // with all other filters unchanged
  }

  subscribe("active-filter-list", combineActiveFilters);
  subscribe("active-filter-list", combinePredictiveFilter);
});
