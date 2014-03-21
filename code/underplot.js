within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData,
    no = this.no,

    distance,

    // map of i -> i*i
    squares = [];

  // Square the given value
  function power2(a){
    // retrieve from cache
    var square = squares[a];
    if ( no(square) ) { // not found
      // compute the value
      square = a*a;
      // save in cache
      squares[a] = square;
    }
    return square;
  }

  // Get the expected width in tiles
  // of a circle drawn with given number of tiles
  function getExpectedWidth(tilesCount){
    // derives from
    // (Area or Circle) = PI * (diameter)² / 4
    // with the area of the circle counted in tile units
    return Math.round( Math.sqrt( 4 * tilesCount / Math.PI ) );
  }

  // Compute the distance from the tile
  // at position (x,y) to the center (0,0)
  // multiplied by 4
  function distance4(x, y){
    return 4 * power2(x) + 4 * power2(y);
  }

  // alias
  distance = distance4;

  function prepareTileSequences(tilesCount){
    var
      ERROR_MARGIN = 2, // one tile on each side of the diameter

      // compute maximum width expected, with an error margin to account
      // for circles one tile larger than the predicted width
      maximumWidth = getExpectedWidth(tilesCount) + ERROR_MARGIN,

      // compute the maximum distance value for the tile
      // at the maximum width on the diagonal on the axis x=y
      maximumDistance = distance(maximumWidth, maximumWidth),

      // Compute distances in the circle sector between the vertical
      // axis y=0 and the diagonal axis x=y, until the maximum distance
      // is reached on the vertical axis; store computed distances in a
      // list of tiles of the form [distance, x, y].
      circleSectorTiles = [],
      y = 0,
      x;

    do {
      for (x=0; x<=y; x++){
        circleSectorTiles.push( [distance(x,y), x, y] );
      }
      y++;
    } while (distance(0,y) < maximumDistance);

    // sort tiles [x,y,distance] by distance, then y, then x
    circleSectorTiles.sort(function(tile1,tile2){
      // sort by distance
      var difference = tile1[0] - tile2[0];
      if ( difference === 0 ){
        // sort by x
        difference = tile1[1] - tile2[1];
      }
      return difference;
    });

    publish("circle-maximum-y", y-1);
    publish("circle-maximum-width", maximumWidth);
    publish("circle-maximum-value", maximumDistance);
    publish("circle-sector-tiles", circleSectorTiles);
  }

  subscribe("authors", function(authors){
    prepareTileSequences( count(authors) );
  });

});
