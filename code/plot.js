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

  function increaseRight(parentBox, columnPosition){
    if ( no(parentBox.header) ){
      return;
    }

    parentBox.right += GUTTER_WIDTH + parentBox.header[columnPosition];
  }

  function increaseBottom(parentBox, height){
    parentBox.bottom += GUTTER_HEIGHT + height;
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
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: box[0][1],
          height: box[1][0],
          shapes: []
        };
        reduce(chart, box[1], addBoxes)
        parentBox.push(chart);
        delete chart.top;
        delete chart.left;
        delete chart.bottom;
        delete chart.right;
        break;
      case 'table-layout':
        table = {
          type: 'table',
          top: parentBox.bottom,
          left: parentBox.right,
          bottom: parentBox.bottom,
          right: parentBox.right,
          shapes: []
        };
        reduce(table, box, addBoxes);
        parentBox.shapes = parentBox.shapes.concat(table.shapes);
        break;
      case 'shape':
        box.top = parentBox.bottom;
        box.left = parentBox.right;
        parentBox.shapes.push(box);
        break;
      case 'header':
        parentBox.header = box;
        break;
      case 'row':
        parentBox.right = parentBox.left;
        reduce(parentBox, box, function(parentBox, box, position){
          if ( position === 0 ){
            // skip row header
            rowHeight = box;
            return parentBox;
          }
          addBoxes(parentBox, box, position);
          increaseRight(parentBox, position);
          return parentBox;
        });
        increaseBottom(parentBox, rowHeight);
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
