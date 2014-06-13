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
      contributions = author[AUTHOR_CONTRIBUTIONS];

    forEach(contributions, function(contribution) {
      if ( filterRegExp.test(contribution) ) {
        totalMatchingContributions++;
      }
    });

    return totalMatchingContributions;
  }

  function getActiveFilterExpression() {
    var
      activeFilterSet = get("active-filter-set"),
      activeFilterExpression = FILTER_START,
      separator = '';

    forEach(CONTRIBUTION_CODE_FILTERS, function(filterName) {
      var activeFilter = activeFilterSet[filterName];
      activeFilterExpression += separator;
      if ( no(activeFilter) ) {
        activeFilterExpression += WILDCARD_FILTER;
      } else {
        activeFilterExpression += activeFilter.value;
      }
      separator = FILTER_SEPARATOR;
    });

    activeFilterExpression += FILTER_END;
    return new RegExp(activeFilterExpression);
  }

  function getActiveMultiplier() {
    var
      activeFilterSet = get("active-filter-set"),
      activeMultiplierFilter =
        activeFilterSet[TOTAL_CONTRIBUTIONS_FILTER],
      activeMultiplier;

    if ( no(activeMultiplierFilter) ) {
      activeMultiplier = 1;
    } else {
      activeMultiplier = Number(activeMultiplierFilter.value);
    }

    return activeMultiplier;
  }

  function getActiveSelectorFunction() {
    var
      filterRegExp = getActiveFilterExpression(),
      multiplier = getActiveMultiplier();
    return function(author) {
      return getTotalMatchingContributions(author, filterRegExp) >= multiplier;
    };
  }

  // combine active filters to compute the selector function
  // to apply to authors for funnel filtering
  function combineActiveFilters(activeFilterList) {
    if ( activeFilterList.length === 0 ) {
      // shortcut
      publish("are-all-authors-selected", true);
      publish("active-filter-selector", alwaysTrue);
      return;
    }

    publish("are-all-authors-selected", false);
    publish("active-filter-selector", getActiveSelectorFunction() );
  }

  subscribe("active-filter-list", combineActiveFilters);

  this.getTotalMatchingContributions = getTotalMatchingContributions;
  this.getActiveFilterExpression = getActiveFilterExpression;
  this.getActiveMultiplier = getActiveMultiplier;
});
