within("projetmedea.fr", function(publish, subscribe, get){
  var
    // TODO: use forEachData instead
    forEach = this.forEach,
    forEachData = this.forEachData,

    CATEGORY_NAME = 0,
    CATEGORY_AUTHORS = 1;

  function getFilterText(category){
    var
      categoryName = category[CATEGORY_NAME],
      categoryAuthors = category[CATEGORY_AUTHORS],
      totalAuthors = categoryAuthors.length;
    return (
      categoryName +
      " (" +
      totalAuthors +
      " author" +
      (totalAuthors===1? "": "s") +
      ")"
    );
  }

  function getAuthorsSelectedByFilter(filterName, filterValue){
    var
      categories = get(filterName),
      authors = [];

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
      filterValue = select.value;

    publish("filter-selected",{
      name: filterName,
      value: filterValue,
      authors: getAuthorsSelectedByFilter(filterName, filterValue)
    });
  }

  function fillFilterSelectionList(select, categories){
    var
      options = document.createDocumentFragment(),
      isFirstOption = select.childNodes.length === 0;

    // TODO: use forEachData instead
    forEach(categories, function(category, categoryPosition){
      if ( categoryPosition === 0 ) {
        return; // skip header row
      }
      var
        option = document.createElement("option"),
        optionText = getFilterText(category),
        text = document.createTextNode(optionText);

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
      }
      option.setAttribute("value", category[CATEGORY_NAME]);
      option.appendChild(text);
      options.appendChild(option);
      isFirstOption = false;
    });
    select.appendChild(options);
    // publish initial filter
    publishSelectedFilter(select);
  }

  function filter(name){
    var
      selectId = name + "-filter",
      select = document.getElementById(selectId),
      dataPropertyName = name + "-categories";

    subscribe(dataPropertyName, function(categories){
      fillFilterSelectionList(select, categories);
    });

    select.onchange = function(){
      publishSelectedFilter(select);
    };
  }

  this.filter = filter;
});
