within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,

    chartsBox = document.getElementById("svg-charts");

    CHART_BACKGROUND_COLOR = "black",

    // margins around the chart, in tiles
    TOP_MARGIN = 1,
    BOTTOM_MARGIN = 1,
    LEFT_MARGIN = 1,
    RIGHT_MARGIN = 1,

    // size of a tile in pixels
    TILE_WIDTH = 6,
    TILE_HEIGHT = 6,

    // radius of the circle drawn in a tile
    CIRCLE_RADIUS = 1.5;

  function drawShape(svg, shape){
    var g = svg.append("g");
    g.attr("fill", shape.color);
    g.append("title").text(shape.name);
    forEach(shape.tiles, function(tile){
      var circle = g.append("circle");
      circle.attr("r", CIRCLE_RADIUS);
      circle.attr("cy", ( TOP_MARGIN + tile[0] + 0.5 ) * TILE_HEIGHT);
      circle.attr("cx", ( LEFT_MARGIN + tile[1] + 0.5 ) * TILE_WIDTH);
    });
  }

  function renderChart(chart){
    var
      svg = d3.select(chartsBox).append("svg"),
      width = ( chart.width + LEFT_MARGIN + RIGHT_MARGIN ) * TILE_WIDTH,
      height = ( chart.height + TOP_MARGIN + BOTTOM_MARGIN )  * TILE_HEIGHT,
      background = svg.append("rect");

    svg.attr("width", width);
    svg.attr("height", height);

    background.attr("width", width);
    background.attr("height", height);
    background.attr("fill", CHART_BACKGROUND_COLOR);

    forEach(chart.shapes, function(shape){
      drawShape(svg, shape);
    });
  }

  function renderCharts(charts){
    chartsBox.innerHTML = "";
    forEach(charts, renderChart);
    publish("svg-rendered", chartsBox.innerHTML);
  }

  subscribe("plot", renderCharts);

});
