within("projetmedea.fr", function(){
  var
    no = this.no;

  // Get the expected width in tiles
  // of a circle drawn with given number of tiles
  function getExpectedCircleWidth(tilesCount){
    // derives from
    // (Area or Circle) = PI * (diameter)² / 4
    // with the area of the circle counted in tile units
    return Math.round( Math.sqrt( 4 * tilesCount / Math.PI ) );
  }

  // Get the type of given box found within a layout hierarchy
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

  this.getExpectedCircleWidth = getExpectedCircleWidth;
  this.getBoxType = getBoxType;
});
