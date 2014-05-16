within("projetmedea.fr", function(publish, subscribe, get){
  var
    countData = this.countData,
    getDataSet = this.getDataSet,
    forEachData = this.forEachData,
    reduceData = this.reduceData,
    no = this.no,
    max = this.max,
    padLeft = this.padLeft,
    padRight = this.padRight,
    getSelectedOption = this.getSelectedOption,

    // non-breaking space, used in padding
    NBSP = "\u00A0",

    LIST_ITEM_NAME = 0,
    LIST_ITEM_VALUE = 1,

    CATEGORY_AUTHORS = 1,

    // hidden option used to measure the size of an option
    // with a given text in the same style.
    // The option shall be alone in a select, within a label
    // hidden using CSS visibility hidden, not display none.
    HIDDEN_OPTION_ID = "hidden-filter-option";

  function getExtraText(totalCategoryAuthors, totalAuthors){
    var maxLength = String(totalAuthors).length;
    return (
      "(" +
      padLeft( String(totalCategoryAuthors), maxLength, NBSP) +
      "/" +
      totalAuthors +
      ")"
    );
  }

  function fillFilterSelectionList(
    select, listData, categories, isAuthorSelected, totalAuthors
  ){
    var
      options = document.createDocumentFragment(),
      isFirstOption = select.childNodes.length === 0,
      maxCategoryNameLength,
      DEFAULT_CATEGORY = 1,
      totalCategories = countData(listData) - DEFAULT_CATEGORY,
      totalCategoriesDisplay =
        document.getElementById( select.id + "-total" );

    if ( !no(totalCategoriesDisplay) ) {
      select.nextSibling.innerHTML = " /" + totalCategories;
    }

    maxCategoryNameLength =
      reduceData(0, listData, function(accumulator, listItem) {
        var categoryName = listItem[LIST_ITEM_NAME];
        return max(accumulator, categoryName.length);
      });

    forEachData(listData, function(listItem){
      var
        categoryName = listItem[LIST_ITEM_NAME],
        category = categories[categoryName],
        option = document.createElement("option"),
        baseText,
        fullText,
        extraText;

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
        extraText = getExtraText( totalAuthors, totalAuthors );
      } else {
        if ( no(category) ) {
          extraText = '(No Authors)';
        } else {
          extraText = getExtraText(
            category[CATEGORY_AUTHORS].length,
            totalAuthors
          );
        }
      }
      // pad category name on the left to align extra text on the right
      baseText = padRight(categoryName, maxCategoryNameLength, NBSP);
      fullText = baseText + " " + extraText;
      option.setAttribute("data-short-text", categoryName);
      option.setAttribute("data-base-text", baseText);
      option.setAttribute("data-full-text", fullText);
      option.setAttribute("value", listItem[LIST_ITEM_VALUE]);
      option.appendChild(
        document.createTextNode(fullText)
      );
      options.appendChild(option);
      isFirstOption = false;
    });
    select.appendChild(options);
  }

  function publishSelectedFilter(select, listItems, categories) {
    var
      value = select.value,
      isFirstOption = select.firstChild.value === value,
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
    if ( no(category) ) {
      // missing categories correspond to an empty set
      // (except the default option, for which the property is deleted)
      filter.authors = [];
    } else {
      filter.authors = category[CATEGORY_AUTHORS];
    }
    if ( isFirstOption ) {
      // do not set authors property for default option
      // (a missing property corresponds to all authors)
      delete filter.authors;
    }
    publish("filter-selected", filter);
  }

  function setOptionText( option, text ) {
    option.firstChild.nodeValue = text;
  }

  // measure the clientWidth of a hidden select created for this purpose
  function getSelectWidth( optionText ) {
    var hiddenOption = document.getElementById(HIDDEN_OPTION_ID);
    setOptionText(hiddenOption, optionText);
    return hiddenOption.parentNode.clientWidth;
  }

  function getSelectedOptionText( selectedOption, size ) {
    return selectedOption.getAttribute("data-"+size+"-text");
  }

  // adjust the width of the select to match the width of selected option
  function adjustSelectWidth( select, selectedOptionText ) {
    select.style.width = getSelectWidth( selectedOptionText ) + "px";
  }

  function adjustSelectSize( select, size ) {
    var
      selectedOption = getSelectedOption(select),
      selectedOptionText = getSelectedOptionText(selectedOption, size);

    setOptionText(selectedOption, selectedOptionText);
    adjustSelectWidth(select, selectedOptionText);
  }

  function reduceSelectedOption( select ) {
    // display only the category name
    adjustSelectSize( select, "short" );
  }

  function expandSelectedOption( select ) {
    // restore the full text of the option
    adjustSelectSize( select, "full" );
  }

  function filter(name){
    var
      selectId = name + "-filter",
      select = document.getElementById(selectId),
      listDataPropertyName = name + "-list",
      categoriesPropertyName = name + "-categories",
      listData = get(listDataPropertyName),
      listItems = getDataSet(listData, LIST_ITEM_VALUE),
      categories = getDataSet( get(categoriesPropertyName) ),
      isAuthorSelected,
      totalAuthors,
      isFilterInitialized = false;

    function initFilter() {
      if (
        isFilterInitialized ||
        no(totalAuthors) ||
        no(isAuthorSelected) ) {
        // already initialized, or not ready yet
        return;
      }

      fillFilterSelectionList(
        select, listData, categories, isAuthorSelected, totalAuthors
      );
      reduceSelectedOption(select);
      select.onfocus = function() {
        expandSelectedOption(select);
      };
      select.onblur = function() {
        reduceSelectedOption(select);
      };
      select.onchange = function(){
        publishSelectedFilter(select, listItems, categories);
      };
      isFilterInitialized = true;
    }

    subscribe("authors", function(authors) {
      totalAuthors = countData(authors);
      initFilter();
    });

    subscribe("selected-author-check", function(selectedAuthorCheck){
      isAuthorSelected = selectedAuthorCheck;
      initFilter();
    });
  }

  this.filter = filter;
});
