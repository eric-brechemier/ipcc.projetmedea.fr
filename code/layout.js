within("projetmedea.fr", function(publish, subscribe, get){
  var
    getExpectedCircleWidth = this.getExpectedCircleWidth,
    getBoxType = this.getBoxType,
    forEach = this.forEach,
    find = this.find,
    map = this.map,
    max = this.max,
    percentage = this.percentage,
    warn = this.warn,

    FILTERED_CATEGORY_NAME = this.FILTERED_CATEGORY_NAME,
    FILTERED_CATEGORY_SELECTED_AUTHORS =
      this.FILTERED_CATEGORY_SELECTED_AUTHORS,

    TILE_CIRCLE_WIDTH = 0,

    // offset of the header row in the chart structure
    CHART_HEADER = 0,

    // offset of the subheading in the chart header row record
    CHART_HEADER_SUBHEADING = 3,

    // offset of the header for the row height in each chart row record
    ROW_HEADER = 0,

    GUTTER_WIDTH = this.GUTTER_WIDTH,
    GUTTER_HEIGHT = this.GUTTER_HEIGHT;

  function getAuthorsSelectedInGroup( groupName ){
    var
      selectedCategories = get( "selected-categories" ),
      group = find( selectedCategories, function( selectedCategory ) {
        return selectedCategory[ FILTERED_CATEGORY_NAME ] === groupName;
      });

    return group[ FILTERED_CATEGORY_SELECTED_AUTHORS ];
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

  function getActualCircleWidth(circle){
    var sequence = get(circle.sequenceName);
    return sequence[circle.tilesCount][TILE_CIRCLE_WIDTH];
  }

  function setTilesCountAndAuthorsInCell( cell ) {
    var authors = getAuthorsSelectedInGroup( cell.name );
    cell.authors = authors;
    cell.tilesCount = authors.length;
  }

  function setCellDimensions(cell){
    var
      tilesCount = cell.tilesCount;

    switch (cell.shape) {
      case 'circle':
        cell.sequenceName = getCircleSequenceName(tilesCount);
        cell.width = getActualCircleWidth(cell);
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
      default:
        warn("Unsupported shape value '",cell.shape,"' found in ",cell);
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

  function getMaxDimension(header, size) {
    // the header contains a textual description of the row/column initially
    if ( typeof header === 'string' ) {
      return size;
    }
    return max(header, size);
  }

  // Set the dimensions in a table layout, recursively.
  // Returns the total number of authors represented in this table layout.
  function setTableLayoutDimensionsAndCountAuthors( tableLayout ){
    var
      columnHeaders,
      totalAuthors = 0;

    forEach(tableLayout, function(row, rowPosition){
      if ( rowPosition === CHART_HEADER ){
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
          setTilesCountAndAuthorsInCell(cell);
          totalAuthors += cell.tilesCount;
          setCellDimensions(cell);
          cellWidth = cell.width;
          cellHeight = cell.height;
        } else { // the cell contains a nested table layout
          totalAuthors += setTableLayoutDimensionsAndCountAuthors(cell);
          cellWidth = getTableWidth(cell);
          cellHeight = getTableHeight(cell);
        }

        // set the maximum width of cells in the column header
        columnHeaders[cellPosition] =
          getMaxDimension(columnHeaders[cellPosition], cellWidth);
        // set the maximum height of cells in the row header
        row[ROW_HEADER] =
          getMaxDimension(row[ROW_HEADER], cellHeight);
      });
    });

    return totalAuthors;
  }

  function updateLayout(selectedCategories){
    var
      category = get("group-by"),
      layout = get("layout/"+category)(),
      totalAuthors = get("total-authors"),
      charts,
      chartsAndTotalAuthors = [],
      sortedCharts;

    switch ( getBoxType(layout) ){
      case 'charts':
        charts = layout[1];
        break;
      case 'chart':
        charts = [layout];
        break;
    }

    forEach( charts, function( chart ) {
      // treat each chart as a table layout
      var totalAuthorsInChart =
        setTableLayoutDimensionsAndCountAuthors( chart );

      if ( totalAuthorsInChart > 0 ) {
        chart[ CHART_HEADER ][ CHART_HEADER_SUBHEADING ] =
          totalAuthorsInChart + ' / ' + totalAuthors +
          ' (' + percentage( totalAuthorsInChart, totalAuthors ) + '%)';
        chartsAndTotalAuthors.push({
          chart: chart,
          totalAuthors: totalAuthorsInChart
        });
      }
    });

    // sort charts in descending order of total authors
    chartsAndTotalAuthors.sort(function( objectA, objectB ) {
      return objectB.totalAuthors - objectA.totalAuthors;
    });

    sortedCharts = map( chartsAndTotalAuthors, function( object ) {
      return object.chart;
    });

    publish( "layout",[ ["charts"], sortedCharts ] );
  }

  subscribe("selected-categories", updateLayout);
});
