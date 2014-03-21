within("projetmedea.fr", function(){

  // Get the expected width in tiles
  // of a circle drawn with given number of tiles
  function getExpectedCircleWidth(tilesCount){
    // derives from
    // (Area or Circle) = PI * (diameter)² / 4
    // with the area of the circle counted in tile units
    return Math.round( Math.sqrt( 4 * tilesCount / Math.PI ) );
  }

  this.getExpectedCircleWidth = getExpectedCircleWidth;
});
