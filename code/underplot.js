within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData,
    no = this.no,
    forEach = this.forEach,
    max = this.max,

    getDistance,

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
  function getDistance4(x, y){
    return 4 * power2(x) + 4 * power2(y);
  }

  // alias
  getDistance = getDistance4;

  // Get the width of an odd circle with given maximum y value
  function getOddWidth(yMax){
    return 1 + 2 * yMax; // central cell + 2 * (number of rows above 0)
  }

  // Get the width of an even circle with given maximum y value
  function getEvenWidth(yMax){
    return 2 * yMax; // 2 * (number of rows above 0)
  }

  function addTileAndSymmetricTiles(tileSequence, width, x, y){
    // 1: tile (x,y)
    tileSequence.push([width, x, y]);

    if ( y === 0 ){ // center tile (0,0)
      return;
    }

    // 2: tile (-x,-y) - symmetry of tile (x,y) across center (0,0)
    tileSequence.push([width, -x, -y]);

    if ( x !== 0 ){ // vertical axis x=0
      // 3: tile (-x,y) - symmetry of tile (x,y) across vertical axis x=0
      tileSequence.push([width, -x, y]);
      // 4: tile (x,-y) - symmetry of tile (x,y) across horizontal axis y=0
      tileSequence.push([width, x, -y]);
    }

    if ( x === y ){ // diagonal axis x=y
      return;
    }

    // 5: (-y,x) - symmetry of tile (-x,y) across diagonal axis y=-x
    tileSequence.push([width, -y, x]);
    // 6: (y,-x) - symmetry of tile (-y,x) across center (0,0)
    tileSequence.push([width, y, -x]);

    if ( x !== 0 ){ // vertical axis x= 0
      // 7: (-y,-x) - symmetry of tile (-y,x) across horizontal axis y=0
      tileSequence.push([width, -y, -x]);
      // 8: (y,x) - symmetry of tile (x,y) across diagonal axis x=y
      tileSequence.push([width, y, x]);
    }
  }

  function prepareTileSequences(tilesCount){
    var
      ERROR_MARGIN = 2, // one tile on each side of the diameter

      // Compute maximum width expected, with an error margin to account
      // for circles one tile larger than the predicted width
      maximumWidth = getExpectedWidth(tilesCount) + ERROR_MARGIN,

      // Compute the maximum distance value for the tile
      // at the maximum width on the diagonal on the axis x=y
      maximumDistance = getDistance(maximumWidth, maximumWidth),

      // base sequence of tiles with position and distances computed in a
      // 1/8th circle sector between vertical axis x=0 and diagonal axis x=y
      circleSectorTiles = [],

      // sequence of tiles used to draw circles with an odd number of rows
      // or columns; this sequence starts at tile (0,0), and the center of
      // the coordinates system is in the middle of the tile (0,0).
      oddTileSequence = [],

      // sequence of tiles used to draw circles with an even number of rows
      // or columns; this sequence starts at tile (1,1), and the center of
      // the coordinates system is at the corner of the four tiles (1,1),
      // (1,-1), (-1,1), (-1,-1). There are no tiles on the axes x=0 and y=0,
      // which lie at the boundary between tiles.
      evenTileSequence = [],

      x,
      y,
      distance,

      // maximum width, 1+2*yMax, of the circular shape drawn
      // at each step in the odd sequence
      oddWidth = 0,
      // maximum width, 2*yMax, of the circular shape drawn
      // at each step in the even sequence
      evenWidth = 0;

    // Compute distances in the circle sector between the vertical
    // axis y=0 and the diagonal axis x=y, until the maximum distance
    // is reached on the vertical axis; store computed distances in a
    // list of tiles of the form [distance, x, y].
    y = 0;
    do {
      for (x=0; x<=y; x++){
        distance = getDistance(x,y);
        if ( distance <= maximumDistance ) {
          circleSectorTiles.push( [distance, x, y] );
        }
      }
      y++;
    } while (getDistance(0,y) < maximumDistance);

    // Sort tiles [x,y,distance] by distance, then y, then x
    circleSectorTiles.sort(function(tile1,tile2){
      // sort by distance
      var difference = tile1[0] - tile2[0];
      if ( difference === 0 ){
        // sort by x
        difference = tile1[1] - tile2[1];
      }
      return difference;
    });

    // Insert extra tiles by symmetry to create the two sequences
    // of tiles for even and odd circles
    forEach(circleSectorTiles, function(tile){
      var
        xOdd = tile[1],
        yOdd = tile[2],
        // the circle sector is shifted by x=1, y=1 in odd circles,
        xEven = xOdd + 1,
        yEven = yOdd + 1;

      // Compute the maximum width of the circular shape
      // drawn at each step in each sequence
      oddWidth = max(oddWidth, getOddWidth(yOdd) );
      evenWidth = max(evenWidth, getEvenWidth(yEven) );

      addTileAndSymmetricTiles(oddTileSequence, oddWidth, xOdd, yOdd);
      addTileAndSymmetricTiles(evenTileSequence, evenWidth, xEven, yEven);
    });

    publish("circle-maximum-y", y-1);
    publish("circle-maximum-width", maximumWidth);
    publish("circle-maximum-value", maximumDistance);
    publish("circle-sector-tiles", circleSectorTiles);

    // Publish the sequences of tiles for even and odd circles.
    // The number of tiles in each sequence is the maximum number
    // of tiles that can be drawn with these precomputed sequences.
    publish("even-circle-sequence", evenTileSequence);
    publish("odd-circle-sequence", oddTileSequence);
  }

  subscribe("authors", function(authors){
    prepareTileSequences( count(authors) );
  });

});
