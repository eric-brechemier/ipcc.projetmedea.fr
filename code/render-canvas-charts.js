within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,

    chartsBox = document.getElementById('canvas-charts'),

    CHART_BACKGROUND_COLOR = "black",

    // margins around the chart, in tiles
    TOP_MARGIN = 1,
    BOTTOM_MARGIN = 1,
    LEFT_MARGIN = 1,
    RIGHT_MARGIN = 1,

    // size of a tile in pixels
    TILE_WIDTH = 4,
    TILE_HEIGHT = 4,

    // radius of the circle drawn in a tile
    TILE_RADIUS = TILE_WIDTH / 2,

    // start angle of a circle, in radians
    CIRCLE_START = 0,

    // end angle of a circle, in radians
    CIRCLE_END = 2 * Math.PI;

  function renderShape(context, shape){
    context.fillStyle = shape.color;
    forEach(shape.tiles, function(tile){
      var
        centerTop = ( TOP_MARGIN + tile[0] + 0.5 ) * TILE_HEIGHT,
        centerLeft = ( LEFT_MARGIN + tile[1] + 0.5 ) * TILE_WIDTH;

      context.beginPath();
      context.arc(
        centerLeft,
        centerTop,
        TILE_RADIUS,
        CIRCLE_START,
        CIRCLE_END
      );
      context.fill();
      context.closePath();
    });
  }

  function renderChart(chart){
    var
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      width,
      height;

    width = ( chart.width + LEFT_MARGIN + RIGHT_MARGIN ) * TILE_WIDTH;
    height = ( chart.height + TOP_MARGIN + BOTTOM_MARGIN ) * TILE_WIDTH;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = CHART_BACKGROUND_COLOR;
    context.fillRect(0, 0, width, height);

    forEach(chart.shapes, function(shape){
      renderShape(context, shape);
    });

    chartsBox.appendChild(canvas);
  }

  function renderCharts(charts){
    chartsBox.innerHTML = "";
    forEach(charts, renderChart);
  }

  subscribe("plot", renderCharts);
});
