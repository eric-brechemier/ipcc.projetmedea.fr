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
    showOption = this.showOption,
    hideOption = this.hideOption,

    LIST_ITEM_NAME = this.LIST_ITEM_NAME,
    LIST_ITEM_VALUE = this.LIST_ITEM_VALUE,
    CATEGORY_AUTHORS = this.CATEGORY_AUTHORS,

    // non-breaking space, used in padding
    NBSP = "\u00A0",

    // hidden option used to measure the size of an option
    // with a given text in the same style.
    // The option shall be alone in a select, within a label
    // hidden using CSS visibility hidden, not display none.
    HIDDEN_OPTION_ID = "hidden-filter-option";

  // TODO: inline
  // TODO: rename to getTotalAuthorsSelectedInCategory
  function getTotalCategoryAuthorsSelected(
    category, filterName, filterValue
  ) {
    var
      getTotalAuthorsSelectedPredicted =
        get("selected-authors-prediction");
    return getTotalAuthorsSelectedPredicted(category, filterName, filterValue);
  }

  // TODO: rename to getTotalAuthorsInCategory
  // Get the total number of authors in a category
  // Note: this function's signature must match the signature
  // of the "selected-authors-prediction" function.
  function getTotalCategoryAuthors(category, filterName, filterValue) {
    if ( filterValue === "" ) {
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

  function setFullText(
    option,
    baseText,
    totalCategoryAuthorsSelected,
    totalCategoryAuthors
  ) {
    var fullText = getFullText(
      baseText,
      totalCategoryAuthorsSelected,
      totalCategoryAuthors
    );
    option.setAttribute("data-full-text", fullText);
    setOptionText(option, fullText);
  }

  function hideOptionWithNoAuthorSelected(
    option, totalCategoryAuthorsSelected
  ) {
    if ( totalCategoryAuthorsSelected > 0 ) {
      showOption(option);
    } else {
      hideOption(option);
    }
  }

  function displayTotalCategoriesSelected(
    select, totalCategoriesSelected
  ) {
    var
      totalCategoriesSelectedDisplay =
        document.getElementById( select.id + "-total" )

    if ( !no(totalCategoriesSelectedDisplay) ) {
      totalCategoriesSelectedDisplay.innerHTML =
        " /" + totalCategoriesSelected;
    }
  }

  function fillFilterSelectionList(select, filterName, listData, categories){
    var
      options = document.createDocumentFragment(),
      maxCategoryNameLength,
      totalCategoriesSelected = 0;

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
        filterValue = listItem[LIST_ITEM_VALUE],
        category = categories[categoryName],
        totalCategoryAuthorsSelected =
          getTotalCategoryAuthorsSelected(category, filterName, filterValue),
        totalCategoryAuthors =
          getTotalCategoryAuthors(category, filterName, filterValue),
        baseText,
        fullText;

      if ( isFirstOption ) {
        option.setAttribute("selected", "selected");
      }

      if ( !isFirstOption && totalCategoryAuthorsSelected > 0 ) {
        totalCategoriesSelected++;
      }
      hideOptionWithNoAuthorSelected(
        option,
        totalCategoryAuthorsSelected
      );

      // pad category name on the left to align extra text on the right
      baseText = padRight(categoryName, maxCategoryNameLength, NBSP);
      option.setAttribute("data-short-text", categoryName);
      option.setAttribute("data-base-text", baseText);
      option.setAttribute("value", listItem[LIST_ITEM_VALUE]);
      setFullText(
        option,
        baseText,
        totalCategoryAuthorsSelected,
        totalCategoryAuthors
      );
      options.appendChild(option);
    });
    select.appendChild(options);
    displayTotalCategoriesSelected(select, totalCategoriesSelected);
  }

  function updateFilterSelectionList(select, filterName, listData, categories) {
    var
      options = select.options,
      totalCategoriesSelected = 0;

    forEachData(listData, function(listItem, listItemOffset) {
      var
        isFirstOption = listItemOffset === 0,
        option = options[listItemOffset],
        baseText = option.getAttribute("data-base-text"),
        categoryName = listItem[LIST_ITEM_NAME],
        filterValue = listItem[LIST_ITEM_VALUE],
        category = categories[categoryName],
        totalCategoryAuthorsSelected =
          getTotalCategoryAuthorsSelected(category, filterName, filterValue),
        totalCategoryAuthors =
          getTotalCategoryAuthors(category, filterName, filterValue);

      if ( !isFirstOption && totalCategoryAuthorsSelected > 0 ) {
        totalCategoriesSelected++;
      }
      hideOptionWithNoAuthorSelected(
        option,
        totalCategoryAuthorsSelected
      );

      setFullText(
        option,
        baseText,
        totalCategoryAuthorsSelected,
        totalCategoryAuthors
      );
    });

    displayTotalCategoriesSelected(select, totalCategoriesSelected);
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

      fillFilterSelectionList(
        select,
        categoriesPropertyName,
        listData,
        categories
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

    function updateFilter() {
      if ( !isFilterInitialized ) {
        initFilter();
      } else {
        updateFilterSelectionList(
          select,
          categoriesPropertyName,
          listData,
          categories
        );
      }
    }

    subscribe("total-authors", initFilter);
    subscribe("selected-author-check", updateFilter);
  }

  this.filter = filter;
});
