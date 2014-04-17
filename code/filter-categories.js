within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    forEach = this.forEach,
    forEachData = this.forEachData,
    percentage = this.percentage,

    // fields position in category records
    // (fixed in all categories)
    CATEGORY_NAME = 0,
    CATEGORY_AUTHORS = 1,
    CATEGORY_TOTAL_AUTHORS = 2;

  function createFilteredCategoryHeaders(){
    return [
      'name',
      'authors_selected',
      'total_authors_selected',
      'total_authors',
      'percentage_authors_selected'
    ];
  }

  function createFilteredCategory(category, selectedAuthors){
    var totalAuthors = Number(category[CATEGORY_TOTAL_AUTHORS]);
    return [
      category[CATEGORY_NAME],
      selectedAuthors,
      selectedAuthors.length,
      totalAuthors,
      percentage(selectedAuthors.length, totalAuthors)
    ];
  }

  function getSelectedAuthors(authors, isAuthorSelected){
    var selectedAuthors = [];
    forEach(authors, function(authorId){
      if ( isAuthorSelected(authorId) ){
        selectedAuthors.push(authorId);
      }
    });
    return selectedAuthors;
  }

  function filterCategories(){
    var
      isAuthorSelected = get("selected-author-check"),
      categories = get("categories"),
      filteredCategories = [];

    if ( no(isAuthorSelected) || no(categories) ){
      return;
    }

    filteredCategories.push( createFilteredCategoryHeaders() );
    forEachData(categories, function(category){
      var
        authors = category[CATEGORY_AUTHORS],
        selectedAuthors = getSelectedAuthors(authors, isAuthorSelected);
      if ( selectedAuthors.length > 0 ){
        filteredCategories.push(
          createFilteredCategory(category, selectedAuthors)
        );
      }
    });
    publish("selected-categories", filteredCategories);
  }

  subscribe("categories", filterCategories);
  subscribe("selected-author-check", filterCategories);
});
