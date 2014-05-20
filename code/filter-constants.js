within("projetmedea.fr", function() {

  // offset of the column with author identifier in each author record
  this.AUTHOR_ID = 0;

  // offset of the field with the list of author contribution codes
  // in each author record
  this.AUTHOR_CONTRIBUTIONS = 3;

  // offset of the field with the category name in a category record
  this.CATEGORY_NAME = 0;

  // offset of the column with the list of authors in a category record
  this.CATEGORY_AUTHORS = 2;

  // sequence of the names of filters
  // that make up the contribution code
  this.CONTRIBUTION_CODE_FILTERS = [
    "assessment-report-categories",
    "working-group-categories",
    "role-categories",
    "country-categories",
    "institution-type-categories",
    "institution-categories"
  ];

  // name of the filter for the total number of contributions
  // corresponding to the contribution code
  this.TOTAL_CONTRIBUTIONS_FILTER = "total-contributions-categories";

  // part of the filter expression for a filter that matches any value
  // (matches all characters up to the next filter separator)
  this.WILDCARD_FILTER = "[^\\.]+";

  // a wildcard filter which captures the value;
  // used in a relaxed filter expression to capture the filter value
  this.CAPTURE_WILDCARD_FILTER = "(" + this.WILDCARD_FILTER + ")";

  // character used as separator between filters in the filter expression
  this.FILTER_SEPARATOR = "\\.";

  // start of the filter expression:
  // anchor the expression to the start of the string
  this.FILTER_START = "^";

  // end of the filter expression:
  // add the 'x' character before the multiplier,
  // then capture the remaining characters in group CAPTURED_MULTIPLIER.
  this.FILTER_END = "x(.+)$";

});
