within("projetmedea.fr", function(publish, subscribe, get){
  var
    getExpectedCircleWidth = this.getExpectedCircleWidth,
    forEach = this.forEach,
    max = this.max,

    CATEGORY_NAME = 0,
    CATEGORY_TOTAL_AUTHORS_SELECTED = 2,

    TILE_CIRCLE_WIDTH = 0,

    ROW_HEADER = 0,

    GUTTER_WIDTH = 1,
    GUTTER_HEIGHT = 1;

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

  function getCircleSequenceName(tilesCount){
    var
      expectedWidth = getExpectedCircleWidth(tilesCount);
    if ( expectedWidth %2 === 0 ){
      return "even-circle-sequence";
    } else {
      return "odd-circle-sequence";
    }
  }

  function getActualCircleWidth(sequenceName, tilesCount){
    var sequence = get(sequenceName);
    return sequence[tilesCount][TILE_CIRCLE_WIDTH];
  }

  function setCellDimensions(cell){
    var
      tilesCount = getTotalAuthorsSelectedInGroup(cell.name);

    switch (cell.shape) {
      case 'circle':
        cell.sequenceName = getCircleSequenceName(tilesCount);
        cell.width = getActualCircleWidth(cell.sequenceName, tilesCount);
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

  // Compute the sum of widths of columns in given table layout
  // adding gutter width between non-empty columns
  function getTableWidth(tableLayout){
    var
      tableWidth = 0,
      columnHeader = tableLayout[0],
      previousColumnWidth = 0;

    forEach(columnHeader, function(columnWidth, position){
      if ( position === ROW_HEADER ) {
        return; // skip the row header (no width)
      }
      if ( columnWidth === 0 ) {
        return; // skip empty columns
      }
      if ( previousColumnWidth > 0 ) {
        tableWidth += GUTTER_WIDTH;
      }
      tableWidth += columnWidth;
      previousColumnWidth = columnWidth;
    });

    return tableWidth;
  }

  // Compute the sum of heights of rows in given table layout
  // adding gutter height between non-empty rows
  function getTableHeight(tableLayout){
    var
      tableHeight = 0,
      previousRowHeight = 0;

    forEach(tableLayout, function(row, position){
      if ( position === 0 ) {
        return; // skip the column header row (no height)
      }
      var rowHeight = row[ROW_HEADER];
      if ( rowHeight === 0 ){
        return; // skip empty rows
      }
      if ( previousRowHeight > 0 ) {
        // only insert gutter between non-empty rows
        tableHeight += GUTTER_HEIGHT;
      }
      tableHeight += rowHeight;
      previousRowHeight = rowHeight;
    });

    return tableHeight;
  }

  function setLayoutDimensions(tableLayout){
    var
      columnHeaders;

    forEach(tableLayout, function(row, rowPosition){
      if ( rowPosition === 0 ){
        columnHeaders = row;
        return;
      }
      forEach(row, function(cell, cellPosition){
        if ( cellPosition === ROW_HEADER ){
          return; // skip row header cell
        }

        var
          cellWidth,
          cellHeight;

        // Check whether a cell contains a group
        if ( typeof cell.shape === 'string' ){
          setCellDimensions(cell);
          cellWidth = cell.width;
          cellHeight = cell.height;
        } else { // the cell contains a nested table layout
          setLayoutDimensions(cell);
          cellWidth = getTableWidth(cell);
          cellHeight = getTableHeight(cell);
        }

        // set the maximum width of cells in the column header
        columnHeaders[cellPosition] =
          max(columnHeaders[cellPosition], cellWidth);
        // set the maximum height of cells in the row header
        row[ROW_HEADER] =
          max(row[ROW_HEADER], cellHeight);
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
