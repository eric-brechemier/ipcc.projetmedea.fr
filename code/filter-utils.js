within("projetmedea.fr", function(publish, subscribe){
  var
    forEach = this.forEach,

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

  function publishSelectedFilter(select){
    publish("filter-selected",{
      name: select.name,
      value: select.value
    });
  }

  function fillFilterSelectionList(select, categories){
    var
      options = document.createDocumentFragment(),
      isFirstOption = select.childNodes.length === 0;

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
