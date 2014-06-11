within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    forEach = this.forEach,
    forEachData = this.forEachData,
    percentage = this.percentage,

    isAuthorSelected,
    categories,

    CATEGORY_NAME = this.CATEGORY_NAME,
    CATEGORY_AUTHORS = this.CATEGORY_AUTHORS,
    CATEGORY_TOTAL_AUTHORS = this.CATEGORY_TOTAL_AUTHORS;

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
      newIsAuthorSelected = get("selected-author-check"),
      newCategories = get("categories"),
      filteredCategories = [];

    if (
      no(newIsAuthorSelected) ||
      no(newCategories) ||
      (
        newIsAuthorSelected === isAuthorSelected &&
        newCategories === categories
      )
    ){
      return;
    }

    isAuthorSelected = get("selected-author-check");
    categories = get("categories");

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
