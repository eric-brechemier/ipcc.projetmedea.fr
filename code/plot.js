within("projetmedea.fr", function(publish, subscribe, get){
  var
    no = this.no,
    reduce = this.reduce,
    forEach = this.forEach,
    getBoxType = this.getBoxType,
    warn = this.warn,

    TILE_X = 1,
    TILE_Y = 2,

    GUTTER_WIDTH = this.GUTTER_WIDTH,
    GUTTER_HEIGHT = this.GUTTER_HEIGHT;

  function increaseChildLeft(parentBox, width){
    if ( no(width) ){
      return;
    }
    parentBox.childLeft += GUTTER_WIDTH + width;
  }

  function increaseChildTop(parentBox, height){
    if ( height === 0 ) {
      return;
    }
    parentBox.childTop += GUTTER_HEIGHT + height;
  }

  function setVerticalPosition(shape){
    switch (shape.valign) {
      case 'top':
        shape.top = shape.parentTop;
        break;
      case 'middle':
        shape.top = shape.parentTop + shape.parentHeight / 2 - shape.height / 2
        break;
      case 'bottom':
        shape.top = shape.parentTop + shape.parentHeight - shape.height;
        break;
      default:
        warn("Unsupported valign value '",shape.valign,"' found in ",shape);
    }
  }

  function setHorizontalPosition(shape){
    switch (shape.align) {
      case 'left':
        shape.left = shape.parentLeft;
        break;
      case 'center':
        shape.left = shape.parentLeft + shape.parentWidth / 2 - shape.width / 2
        break;
      case 'right':
        shape.left = shape.parentLeft + shape.parentWidth - shape.width;
        break;
      default:
        warn("Unsupported align value '",shape.align,"' found in ",shape);
    }
  }

  function getCircleTiles(circle) {
    var
      sequence = get(circle.sequenceName),
      tilesCount = circle.tilesCount,
      tiles = Array(tilesCount),
      circleTop = circle.top,
      circleLeft = circle.left,
      radius,
      centerTileTop,
      centerTileLeft;

    if ( tilesCount === 0 ){
      return [];
    }

    if ( circle.width % 2 === 0 ){
      // even circle: tile (0,0) is on the top-right of the center point
      radius = circle.width / 2;
      centerTileLeft = circle.left + radius;
      centerTileTop = circle.top + radius - 1;
    } else {
      // odd circle: 1 center tile in the middle
      radius = (circle.width - 1) / 2;
      centerTileLeft = circle.left + radius;
      centerTileTop = circle.top + radius;
    }

    forEach(sequence, function(tile, position){
      if ( position === tilesCount ) {
        return true; // last tile reached already
      }
      var
        tileTop = centerTileTop - tile[TILE_Y],
        tileLeft = centerTileLeft + tile[TILE_X];
      tiles[position] = [tileTop, tileLeft];
    });
    return tiles;
  }

  function getHorizontalLineTiles(shape) {
    var
      i,
      length = shape.width,
      tileTop = shape.top,
      tileLeft = shape.left,
      tiles = Array(length);
    for (i=0; i<length; i++) {
      tiles[i] = [tileTop, tileLeft];
      tileLeft += 1;
    }
    return tiles;
  }

  function getVerticalLineTiles(shape) {
    var
      i,
      length = shape.height,
      tileTop = shape.top,
      tileLeft = shape.left,
      tiles = Array(length);
    for (i=0; i<length; i++) {
      tiles[i] = [tileTop, tileLeft];
      tileTop += 1;
    }
    return tiles;
  }

  function getTiles(shape) {
    switch (shape.shape) {
      case 'circle':
        return getCircleTiles(shape);
      case 'line':
        return getHorizontalLineTiles(shape);
      case 'vline':
        return getVerticalLineTiles(shape);
    }
  }

  function addBoxes(parentBox, box, position){
    var
      boxType = getBoxType(box),
      chart,
      table;

    switch ( boxType ){
      case 'charts':
        return reduce(parentBox, box[1], addBoxes);
      case 'chart':
        chart = {
          type: 'chart',
          heading: box[0][2],
          subheading: box[0][3],
          parentTop: 0,
          parentLeft: 0,
          childTop: 0,
          childLeft: 0,
          width: box[0][1],
          childWidth: box[0][1],
          height: box[1][0],
          childHeight: box[1][0],
          shapes: []
        };
        reduce(chart, box[1], addBoxes);
        parentBox.push(chart);
        delete chart.parentTop;
        delete chart.parentLeft;
        delete chart.childTop;
        delete chart.childLeft;
        delete chart.childWidth;
        delete chart.childHeight;
        break;
      case 'table-layout':
        table = {
          type: 'table',
          parentTop: parentBox.childTop,
          parentLeft: parentBox.childLeft,
          parentWidth: parentBox.childWidth,
          parentHeight: parentBox.childHeight,
          childTop: parentBox.childTop,
          childLeft: parentBox.childLeft,
          shapes: parentBox.shapes
        };

        forEach(box, function(row, rowPosition){
          if ( rowPosition === 0 ){
            // column header row
            table.columnWidths = row;
            return;
          }

          table.childLeft = parentBox.childLeft;
          forEach(row, function(cell, columnPosition){
            if ( columnPosition === 0 ){
              // row header cell: row height
              if ( box.length === 2 ) {
                // stretch single row to full height
                table.childHeight = table.parentHeight;
              } else {
                table.childHeight = cell;
              }
              return;
            }
            if ( row.length === 2 ) {
              // stretch single column to full width
              table.childWidth = table.parentWidth;
            } else {
              table.childWidth = table.columnWidths[columnPosition];
            }
            addBoxes(table, cell, columnPosition);
            increaseChildLeft(table, table.childWidth);
          });
          increaseChildTop(table, table.childHeight);
        });
        break;
      case 'shape':
        box.parentTop = parentBox.childTop;
        box.parentLeft = parentBox.childLeft;
        box.parentHeight = parentBox.childHeight;
        box.parentWidth = parentBox.childWidth;
        setVerticalPosition(box);
        setHorizontalPosition(box);
        box.tiles = getTiles(box);
        parentBox.shapes.push(box);
        delete box.parentTop;
        delete box.parentLeft;
        delete box.parentHeight;
        delete box.parentWidth;
        delete box.align;
        delete box.valign;
        break;
      case 'header':
        parentBox.header = box;
        break;
      default:
        break;
    }
    return parentBox;
  }

  function plot(groupLayout){
    publish("plot", addBoxes([], groupLayout) );
  }

  subscribe("layout", plot);
});
