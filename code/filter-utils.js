within("projetmedea.fr", function(publish, subscribe, get){
  var
    countData = this.countData,
    getDataSet = this.getDataSet,
    forEachData = this.forEachData,
    no = this.no,

    LIST_ITEM_NAME = 0,
    LIST_ITEM_VALUE = 1,

    CATEGORY_AUTHORS = 1;

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
  }

  function publishSelectedFilter(select, listItems, categories) {
    var
      value = select.value,
      listItem = listItems[value],
      categoryName = listItem[LIST_ITEM_NAME],
      category,
      filter = {
        name: select.name,
        value: value
      };

    if ( !no(categoryName) ) {
      filter.categoryName = categoryName;
      category = categories[categoryName];
    }
    if ( !no(category) ) {
      filter.authors = category[CATEGORY_AUTHORS];
    }
    publish("filter-selected", filter);
  }

  function filter(name){
    var
      selectId = name + "-filter",
      select = document.getElementById(selectId),
      listDataPropertyName = name + "-list",
      categoriesPropertyName = name + "-categories",
      listData = get(listDataPropertyName),
      listItems = getDataSet(listData, LIST_ITEM_VALUE),
      categories = getDataSet( get(categoriesPropertyName) );

    subscribe("authors", function(authors){
      var totalAuthors = countData(authors);
      fillFilterSelectionList(select, listData, categories, totalAuthors);
      select.onchange = function(){
        publishSelectedFilter(select, listItems, categories);
      };
    });
  }

  this.filter = filter;
});
