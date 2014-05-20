within("projetmedea.fr", function(publish, subscribe, get) {
  var
    no = this.no,
    forEach = this.forEach,
    forEachProperty = this.forEachProperty,
    getActiveFilterExpression = this.getActiveFilterExpression,
    getActiveMultiplier = this.getActiveMultiplier,
    getTotalMatchingContributions = this.getTotalMatchingContributions,

    AUTHOR_CONTRIBUTIONS = this.AUTHOR_CONTRIBUTIONS,
    CATEGORY_NAME = this.CATEGORY_NAME,
    CONTRIBUTION_CODE_FILTERS = this.CONTRIBUTION_CODE_FILTERS,
    TOTAL_CONTRIBUTIONS_FILTER = this.TOTAL_CONTRIBUTIONS_FILTER,
    WILDCARD_FILTER = this.WILDCARD_FILTER,
    CAPTURE_WILDCARD_FILTER = this.CAPTURE_WILDCARD_FILTER,
    FILTER_SEPARATOR = this.FILTER_SEPARATOR,
    FILTER_START = this.FILTER_START,
    FILTER_END = this.FILTER_END;

  // For given author, find all the values which would match if they
  // were selected with other active filters kept unchanged
  function getMatchingValues(author, relaxedFilterRegExp, activeMultiplier) {
    var
      // list of filter values matching relaxed filter + active multiplier
      filterValuesList = [],
      // map of filter value -> total contributions
      //                        matching active filters + this value
      filterValuesSet = {},
      contributions = author[AUTHOR_CONTRIBUTIONS],

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
      multiplier = Number( match[CAPTURED_MULTIPLIER] );

      if ( !filterValuesSet.hasOwnProperty(value) ) {
        filterValuesSet[value] = multiplier;
      } else {
        filterValuesSet[value] += multiplier;
      }
    });

    forEachProperty(filterValuesSet, function(multiplier, filterValue) {
      if ( multiplier >= activeMultiplier ) {
        filterValuesList.push(filterValue);
      }
    });

    return filterValuesList;
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
  // which values of this filter may be selected for an author to match,
  // all other filters being left unchanged
  function preparePredictiveFilters() {
    var
      activeFilterRegExp = getActiveFilterExpression(),
      activeMultiplier = getActiveMultiplier(),
      relaxedFilterExpressions = {},
      // map of filter name -> map of filter value -> number of authors
      predictiveFiltersRoot = {};

    forEach(CONTRIBUTION_CODE_FILTERS, function(filterName) {
      relaxedFilterExpressions[filterName] =
        getRelaxedFilterExpression(filterName);
      predictiveFiltersRoot[filterName] = {};
    });
    predictiveFiltersRoot[TOTAL_CONTRIBUTIONS_FILTER] = {};

    // Get predictive filters for a given author
    //
    // Parameter:
    //   author - array, author record
    //
    // Returns:
    //   object, the set of predictive filters,
    //   a map of filter name -> array of filter values:
    //   for each filter including the TOTAL_CONTRIBUTIONS_FILTER,
    //   the property contains an array with the list of filter values
    //   for which the author would match as string values.
    function getPredictiveFilters(author) {
      var
        predictiveFilters = {},
        totalContributionsSelected,
        totalContributionsList = [],
        i;

      forEach(CONTRIBUTION_CODE_FILTERS, function(filterName) {
        var relaxedFilterRegExp = relaxedFilterExpressions[filterName];
        predictiveFilters[filterName] =
          getMatchingValues(author, relaxedFilterRegExp, activeMultiplier);
      });

      totalContributionsSelected =
        getTotalMatchingContributions(author, activeFilterRegExp);
      for ( i=1; i<=totalContributionsSelected; i++ ) {
        totalContributionsList.push( String(i) );
      }
      predictiveFilters[TOTAL_CONTRIBUTIONS_FILTER] = totalContributionsList;

      return predictiveFilters;
    }

    publish("predictive-filters-root", predictiveFiltersRoot);
    publish("predictive-filter-function", getPredictiveFilters);
    publish("active-and-predictive-filters-ready");
  }

  subscribe("active-filter-selector", preparePredictiveFilters);
});
