within("projetmedea.fr", function(publish, subscribe, get){
  var
    getExpectedCircleWidth = this.getExpectedCircleWidth,
    forEach = this.forEach,
    CATEGORY_NAME = 0,
    CATEGORY_TOTAL_AUTHORS_SELECTED = 2,
    TILE_CIRCLE_WIDTH = 0;

  function getTotalAuthorsSelectedInGroup(groupName){
    var
      selectedAuthors = 0,
      selectedCategories = get("selected-categories");
    forEach(selectedCategories, function(selectedCategory){
      if ( selectedCategory[CATEGORY_NAME] === groupName ){
        selectedAuthors = selectedCategory[CATEGORY_TOTAL_AUTHORS_SELECTED];
        return true;
      }
    });
    return selectedAuthors;
  }

  function getCircleWidth(tilesCount){
    var
      expectedWidth = getExpectedCircleWidth(tilesCount),
      sequence;

    if ( expectedWidth %2 === 0 ){
      sequence = get("even-circle-sequence");
    } else {
      sequence = get("odd-circle-sequence");
    }
    return sequence[tilesCount][TILE_CIRCLE_WIDTH];
  }

  function setCellDimensions(cell){
    var
      tilesCount = getTotalAuthorsSelectedInGroup(cell.name);

    switch (cell.shape) {
      case 'circle':
        cell.width = getCircleWidth(tilesCount);
        cell.height = cell.width;
        break;
      case 'line':
        cell.width = tilesCount;
        cell.height = 1;
        break;
      case 'vline': // vertical line
        cell.width = 1;
        cell.height = tilesCount;
        break;
    }
  }

  function setLayoutDimensions(tableLayout){
    var tableHeaderRow;

    forEach(tableLayout, function(row, rowPosition){
      if ( rowPosition === 0 ){
        tableHeaderRow = row;
        return;
      }
      forEach(row, function(cell, cellPosition){
        if ( cellPosition === 0 ){
          return; // skip row header cell
        }

        // Check whether a cell contains a group
        if ( typeof cell.shape === 'string' ){
          setCellDimensions(cell);
        } else { // the cell contains a nested table layout
          setLayoutDimensions(cell);
        }
      });
    });
  }

  function updateLayout(selectedCategories){
    var
      category = get("group-by"),
      layout = get("layout/"+category)();

    setLayoutDimensions(layout);
    publish("group-layout", layout);
  }

  subscribe("selected-categories", updateLayout);
});
