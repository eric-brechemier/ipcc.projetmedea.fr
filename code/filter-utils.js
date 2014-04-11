within("projetmedea.fr", function(publish, subscribe, get){
  var
    forEachData = this.forEachData,
    no = this.no,

    LIST_ITEM_NAME = 0,
    LIST_ITEM_VALUE = 1,

    CATEGORY_NAME = 0,
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

  function fillFilterSelectionList(select, listData){
    var
      options = document.createDocumentFragment(),
      isFirstOption = select.childNodes.length === 0;

    forEachData(listData, function(listItem){
      var
        option = document.createElement("option"),
        optionText = listItem[LIST_ITEM_NAME],
        text = document.createTextNode(optionText);

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
      }
      option.setAttribute("value", listItem[LIST_ITEM_VALUE]);
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
      listDataPropertyName = name + "-list";

    subscribe(listDataPropertyName, function(listData){
      fillFilterSelectionList(select, listData);
    });

    /*
    select.onchange = function(){
      publishSelectedFilter(select);
    };
    */
  }

  this.filter = filter;
});
