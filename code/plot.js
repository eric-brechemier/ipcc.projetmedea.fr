within("projetmedea.fr", function(publish, subscribe){
  var
    no = this.no,
    reduce = this.reduce,
    forEach = this.forEach,

    GUTTER_WIDTH = 1,
    GUTTER_HEIGHT = 1;

  function getBoxType(box){
    var boxType = typeof box;
    if (
      boxType === 'object' &&
      typeof box.shape === 'string'
    ) {
      return 'shape';
    }
    if ( no(box) ) {
      return null;
    }
    if ( boxType === 'string' ) {
      return boxType;
    }
    if ( typeof box[0] === 'string' ) {
      return 'header';
    }
    if ( typeof box[0] === 'number' ) {
      return 'row';
    }
    if ( !no(box[0]) && typeof box[0][0] === 'string' ) {
      return box[0][0];
    }
    return boxType;
  }

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

  function addBoxes(parentBox, box, position){
    var
      boxType = getBoxType(box),
      chart,
      table;

    switch ( boxType ){
      case 'charts':
        return reduce(parentBox, box, addBoxes);
      case 'chart':
        chart = {
          type: 'chart',
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
        parentBox.shapes.push(box);
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

  subscribe("group-layout", plot);
});
