within("projetmedea.fr", function(publish, subscribe){
  var
    no = this.no,
    reduce = this.reduce,

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

  function increaseChildLeft(parentBox, columnPosition){
    if ( no(parentBox.header) ){
      return;
    }
    var width = parentBox.header[columnPosition];
    if ( width === 0 ){
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
      table,
      rowHeight;
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
          height: box[1][0],
          shapes: []
        };
        reduce(chart, box[1], addBoxes)
        parentBox.push(chart);
        delete chart.parentTop;
        delete chart.parentLeft;
        delete chart.childTop;
        delete chart.childLeft;
        break;
      case 'table-layout':
        table = {
          type: 'table',
          parentTop: parentBox.childTop,
          parentLeft: parentBox.childLeft,
          childTop: parentBox.childTop,
          childLeft: parentBox.childLeft,
          shapes: []
        };
        reduce(table, box, addBoxes);
        parentBox.shapes = parentBox.shapes.concat(table.shapes);
        break;
      case 'shape':
        box.parentTop = parentBox.childTop;
        box.parentLeft = parentBox.childLeft;
        parentBox.shapes.push(box);
        break;
      case 'header':
        parentBox.header = box;
        break;
      case 'row':
        parentBox.childLeft = parentBox.parentLeft;
        reduce(parentBox, box, function(parentBox, box, position){
          if ( position === 0 ){
            // skip row header
            rowHeight = box;
            return parentBox;
          }
          addBoxes(parentBox, box, position);
          increaseChildLeft(parentBox, position);
          return parentBox;
        });
        increaseChildTop(parentBox, rowHeight);
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
