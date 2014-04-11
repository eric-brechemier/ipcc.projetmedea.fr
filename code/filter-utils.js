within("projetmedea.fr", function(publish, subscribe, get){
  var
    countData = this.countData,
    getDataSet = this.getDataSet,
    forEachData = this.forEachData,
    no = this.no,

    LIST_ITEM_NAME = 0,
    LIST_ITEM_VALUE = 1,

    CATEGORY_AUTHORS = 1;

  // Get the list of authors selected by given filter,
  // or null for the default option which accepts all authors.
  //
  // Note: an empty array is returned for an unknown category,
  // which results in no authors being selected.
  function getAuthorsSelectedByFilter(filterName, filterValue){
    var
      categories = get(filterName),
      categoryAuthors = [];

    if ( filterValue === "" ) {
      return null;
    }

    forEachData(categories, function(category){
      if ( category[CATEGORY_NAME] === filterValue ) {
        authors = category[CATEGORY_AUTHORS];
        return true;
      }
    });

    return authors;
  }

  function publishSelectedFilter(select){
    var
      filterName = select.name,
      filterValue = select.value,
      filterAuthors =
        getAuthorsSelectedByFilter(filterName, filterValue),
      filter = {
        name: filterName,
        value: filterValue
      };
    // do not set the 'authors' property to a null value
    if ( !no(filterAuthors) ) {
      filter.authors = filterAuthors;
    }
    publish("filter-selected",filter);
  }

  function getExtraText(totalCategoryAuthors){
    return (
      totalCategoryAuthors +
      " author" +
      (totalCategoryAuthors===1? "": "s")
    );
  }

  function fillFilterSelectionList(select, listData, categories, totalAuthors){
    var
      options = document.createDocumentFragment(),
      isFirstOption = select.childNodes.length === 0;

    forEachData(listData, function(listItem){
      var
        categoryName = listItem[LIST_ITEM_NAME],
        category = categories[categoryName],
        option = document.createElement("option"),
        optionText = categoryName,
        text = document.createTextNode(optionText),
        extraText;

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
        extraText = getExtraText(totalAuthors);
      } else {
        if ( no(category) ) {
          extraText = 'No Authors';
        } else {
          extraText = getExtraText(category[CATEGORY_AUTHORS].length);
        }
      }
      option.setAttribute("value", listItem[LIST_ITEM_VALUE]);
      option.setAttribute("data-extra", extraText);
      option.appendChild(text);
      options.appendChild(option);
      isFirstOption = false;
    });
    select.appendChild(options);
    // publish initial filter
    // publishSelectedFilter(select);
  }

  function filter(name){
    var
      selectId = name + "-filter",
      select = document.getElementById(selectId),
      listDataPropertyName = name + "-list",
      categoriesPropertyName = name + "-categories",
      listData = get(listDataPropertyName),
      categories = getDataSet( get(categoriesPropertyName) );

    subscribe("authors", function(authors){
      var totalAuthors = countData(authors);
      fillFilterSelectionList(select, listData, categories, totalAuthors);
      /*
      select.onchange = function(){
        publishSelectedFilter(select);
      };
      */
    });
  }

  this.filter = filter;
});
