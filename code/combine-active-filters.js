within("projetmedea.fr", function(publish, subscribe, get) {
  var
    forEach = this.forEach,
    no = this.no,
    alwaysTrue = this.alwaysTrue,

    AUTHOR_CONTRIBUTIONS = this.AUTHOR_CONTRIBUTIONS ,
    CONTRIBUTION_CODE_FILTERS = this.CONTRIBUTION_CODE_FILTERS ,
    TOTAL_CONTRIBUTIONS_FILTER = this.TOTAL_CONTRIBUTIONS_FILTER,
    WILDCARD_FILTER = this.WILDCARD_FILTER,
    FILTER_SEPARATOR = this.FILTER_SEPARATOR,
    FILTER_START = this.FILTER_START,
    FILTER_END = this.FILTER_END;

  function getTotalMatchingContributions(author, filterRegExp) {
    var
      totalMatchingContributions = 0,
      contributions = author[AUTHOR_CONTRIBUTIONS],

    // index of the group captured for the contribution multiplier
    // in an active filter regular expression
    CAPTURED_MULTIPLIER = 1;

    forEach(contributions, function(contribution) {
      var match = filterRegExp.exec(contribution);
      if ( no(match) ) {
        return;
      }
      totalMatchingContributions += Number(match[CAPTURED_MULTIPLIER]);
    });

    return totalMatchingContributions;
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
    return new RegExp(filterExpression);
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

  function getSelectorFunction() {
    var
      filterRegExp = getFilterExpression(),
      multiplier = getMultiplier();
    return function(author) {
      return getTotalMatchingContributions(author, filterRegExp) >= multiplier;
    };
  }

  // combine active filters to compute the selector function
  // to apply to authors for funnel filtering
  function combineActiveFilters(activeFilterList) {
    if ( activeFilterList.length === 0 ) {
      // shortcut
      publish("active-filter-selector", alwaysTrue);
      return;
    }

    publish("active-filter-selector", getSelectorFunction() );
  }

  subscribe("active-filter-list", combineActiveFilters);
});
