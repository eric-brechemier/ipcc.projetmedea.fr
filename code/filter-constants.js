within("projetmedea.fr", function() {

  // offset of the column with author identifier in each author record
  this.AUTHOR_ID = 0;

  // offset of first and middle name in author record
  this.AUTHOR_FIRST_NAME = 1;

  // offset of last name in author record
  this.AUTHOR_LAST_NAME = 2;

  // offset of the field with the list of author contribution codes
  // in each author record
  this.AUTHOR_CONTRIBUTIONS = 3;

  // offset of the item name in a list item record
  this.LIST_ITEM_NAME = 0;

  // offset of the item value in a list item record
  this.LIST_ITEM_VALUE = 1;

  // value of the first item, which lists all authors
  this.LIST_ITEM_DEFAULT_VALUE = "";

  // offset of the field with the category name in a category record
  this.CATEGORY_NAME = 0;

  // offset of the column with the list of authors in a category record
  this.CATEGORY_AUTHORS = 1;

  // offset of the field with the total number of authors in a category
  this.CATEGORY_TOTAL_AUTHORS = 2;

  // offset of the field with the category name in a filtered category record
  this.FILTERED_CATEGORY_NAME = 0;

  // offset of the list of selected authors in a filtered category
  this.FILTERED_CATEGORY_SELECTED_AUTHORS = 1;

  // offset of the total number of authors selected in a filtered category record
  this.FILTERED_CATEGORY_TOTAL_AUTHORS_SELECTED = 2;

  // offset of the assessment report id in a contribution record
  this.CONTRIBUTION_ASSESSMENT_REPORT = 0;

  // offset of the working group in a contribution record
  this.CONTRIBUTION_WORKING_GROUP = 1;

  // offset of the chapter in a contribution record
  this.CONTRIBUTION_CHAPTER = 2;

  // offset of the role id in a contribution record
  this.CONTRIBUTION_ROLE = 3;

  // offset of the country id in a contribution record
  this.CONTRIBUTION_COUNTRY = 4;

  // offset of the institution type id in a contribution record
  this.CONTRIBUTION_INSTITUTION_TYPE = 5;

  // offset of the institution id in a contribution record
  this.CONTRIBUTION_INSTITUTION = 6;

  // sequence of the names of filters
  // that make up the contribution code
  this.CONTRIBUTION_CODE_FILTERS = [
    "assessment-report-categories",
    "working-group-categories",
    "chapter-categories",
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

  // character used as separator in the contribution string
  this.CONTRIBUTION_SEPARATOR = '.';

  // character used as separator between filters in the filter expression
  this.FILTER_SEPARATOR = "\\.";

  // start of the filter expression:
  // anchor the expression to the start of the string
  this.FILTER_START = "^";

  // end of the filter expression:
  this.FILTER_END = "$";

});
