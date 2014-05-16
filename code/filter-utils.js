within("projetmedea.fr", function(publish, subscribe, get){
  var
    countData = this.countData,
    getDataSet = this.getDataSet,
    forEachData = this.forEachData,
    reduceData = this.reduceData,
    reduce = this.reduce,
    alwaysTrue = this.alwaysTrue,
    no = this.no,
    max = this.max,
    padLeft = this.padLeft,
    padRight = this.padRight,
    getSelectedOption = this.getSelectedOption,
    setOptionText = this.setOptionText,

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

  function getTotalCategoryAuthorsSelected(isFirst, category) {
    if ( isFirst ) {
      return get("total-authors-selected");
    }
    if ( no(category) ) {
      return 0;
    }
    var
      categoryAuthors = category[CATEGORY_AUTHORS],
      isAuthorSelected = get("selected-author-check");

    if ( isAuthorSelected === alwaysTrue ) {
      // shortcut: all authors
      return categoryAuthors.length;
    } else {
      return reduce(0, categoryAuthors, function(accumulator, author){
        return accumulator + isAuthorSelected(author)? 1: 0;
      });
    }
  }

  function getTotalCategoryAuthors(isFirst, category) {
    if ( isFirst ) {
      return get("total-authors");
    }
    if ( no(category) ) {
      return 0;
    }
    var categoryAuthors = category[CATEGORY_AUTHORS];
    return categoryAuthors.length;
  }

  function getFullText(
    baseText,
    totalCategoryAuthorsSelected,
    totalCategoryAuthors
  ) {
    var
      totalAuthors = get("total-authors"),
      maxLength = String(totalAuthors).length;
    return (
      baseText +
      NBSP +
      "(" +
      padLeft( String(totalCategoryAuthorsSelected), maxLength, NBSP) +
      "/" +
      padLeft( String(totalCategoryAuthors), maxLength, NBSP) +
      ")"
    );
  }

  function fillFilterSelectionList(select, listData, categories){
    var
      isAuthorSelected = get("selected-author-check"),
      totalAuthors = get("total-authors"),
      totalAuthorsSelected = get("total-authors-selected"),
      options = document.createDocumentFragment(),
      maxCategoryNameLength,
      totalCategoriesSelected = 0,
      totalCategoriesSelectedDisplay =
        document.getElementById( select.id + "-total" );

    maxCategoryNameLength =
      reduceData(0, listData, function(accumulator, listItem) {
        var categoryName = listItem[LIST_ITEM_NAME];
        return max(accumulator, categoryName.length);
      });

    forEachData(listData, function(listItem, listItemOffset){
      var
        isFirstOption = listItemOffset === 0,
        option = document.createElement("option"),
        categoryName = listItem[LIST_ITEM_NAME],
        category = categories[categoryName],
        totalCategoryAuthorsSelected =
          getTotalCategoryAuthorsSelected(isFirstOption, category),
        totalCategoryAuthors =
          getTotalCategoryAuthors(isFirstOption, category),
        baseText,
        fullText;

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
      } else {
        if ( totalCategoryAuthorsSelected > 0 ) {
          totalCategoriesSelected++;
        }
      }
      // pad category name on the left to align extra text on the right
      baseText = padRight(categoryName, maxCategoryNameLength, NBSP);
      fullText = getFullText(
        baseText,
        totalCategoryAuthorsSelected,
        totalCategoryAuthors
      );
      option.setAttribute("data-short-text", categoryName);
      option.setAttribute("data-base-text", baseText);
      option.setAttribute("data-full-text", fullText);
      option.setAttribute("value", listItem[LIST_ITEM_VALUE]);
      option.appendChild(
        document.createTextNode(fullText)
      );
      options.appendChild(option);
    });
    select.appendChild(options);

    if ( !no(totalCategoriesSelectedDisplay) ) {
      totalCategoriesSelectedDisplay.innerHTML =
        " /" + totalCategoriesSelected;
    }
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
      isFilterInitialized = false;

    function initFilter() {
      if (
        isFilterInitialized ||
        no( get("total-authors") ) ||
        no( get("selected-author-check") )
      ) {
        // already initialized, or not ready yet
        return;
      }

      fillFilterSelectionList(select, listData, categories);
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

    function updateFilter() {
      if ( !isFilterInitialized ) {
        initFilter();
        return;
      }
      // TODO: updateFilterSelectionList()
    }

    subscribe("total-authors", initFilter);
    subscribe("selected-author-check", updateFilter);
  }

  this.filter = filter;
});
