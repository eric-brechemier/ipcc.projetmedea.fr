within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData,
    no = this.no,
    this.forEach = this.forEach,

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

      // Compute maximum width expected, with an error margin to account
      // for circles one tile larger than the predicted width
      maximumWidth = getExpectedWidth(tilesCount) + ERROR_MARGIN,

      // Compute the maximum distance value for the tile
      // at the maximum width on the diagonal on the axis x=y
      maximumDistance = distance(maximumWidth, maximumWidth),

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
      y;

    // Compute distances in the circle sector between the vertical
    // axis y=0 and the diagonal axis x=y, until the maximum distance
    // is reached on the vertical axis; store computed distances in a
    // list of tiles of the form [distance, x, y].
    y = 0;
    do {
      for (x=0; x<=y; x++){
        circleSectorTiles.push( [distance(x,y), x, y] );
      }
      y++;
    } while (distance(0,y) < maximumDistance);

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
        distance = tile[0],
        xOdd = tile[1],
        yOdd = tile[2],
        // the circle sector is shifted by x=1, y=1 in odd circles,
        xEven = x0dd + 1,
        yEven = yEven + 1;

      // 1: tile (x,y)
      oddTileSequence.push([distance, xOdd, yOdd]);
      evenTileSequence.push([distance, xEven, yEven]);

      // 2: tile (-x,-y) - symmetry of tile (x,y) across center (0,0)
      if (
        xOdd !== 0 // 2: !== 1: when xOdd!==0 or yOdd!==0
                   // xOdd !== 0 implies yOdd !==0 in circle sector
      ){
        oddTileSequence.push([distance, -xOdd, -yOdd]);
      }
      // no test needed in even circles, since xEven!==0 and yEven!==0
      evenTileSequence.push([distance, -xEven, -yEven]);

      // 3: (-x,y) - symmetry of tile (x,y) across vertical axis x=0
      if (
        xOdd !== 0 // 3: !== 1:
                   // 3: !== 2: yOdd!==0 when xOdd!==0 in circle sector
      ){
        oddTileSequence.push([distance, -xOdd, yOdd]);
      }
      // no test needed in even circles, since xEven!==0 and yEven!==0
      evenTileSequence.push([distance, -xEven, yEven]);

      // 4: (x,-y) - symmetry of tile (x,y) across horizontal axis y=0
      if (
                   // 4: !== 1: yOdd!==0 when xOdd!==0 in circle sector
        xOdd !== 0 // 4: !== 2:
                   // 4: !== 3: when xOdd!==0 or yOdd!==0
      ){
        oddTileSequence.push([distance, xOdd, -yOdd]);
      }
      // no test needed in even circles since x!==0 and y!==0
      evenTileSequence.push([distance, xEven, -yEven]);

      // 5: (-y,x) - symmetry of tile (-x,y) across diagonal axis y=-x
      if (
        xOdd !== 0 && // 5: !== 1: when xOdd!==0 or yOdd!==0
                      // 5: !== 2: when xOdd!==0 or yOdd!==0
                      // i.e., when xOdd!==0 in circle sector
        xOdd !== yOdd // 5: !== 3:
                      // 5: !== 4: xOdd!==-yOdd
                      // i.e., when xOdd!==0 in circle sector
      ){
        oddTileSequence.push([distance, -yOdd, xOdd]);
      }
      if (
        xEven !== 0 &&  // 5: !== 1:, 2:, 4:
        xEven !== yEven // 5: !== 3:
      ){
        evenTileSquence.push([distance, -yEven, xEven]);
      }

      // 6: (y,-x)

      // 7: (-y,-x)

      // 8: (y,x)
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
