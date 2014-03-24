within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,

    chartsBox = document.getElementById("svg-charts");

    CHART_BACKGROUND_COLOR = "black",

    TILE_WIDTH = 4,
    TILE_HEIGHT = 4;

  function drawShape(svg, shape){
    forEach(shape.tiles, function(tile){
      var circle = svg.append("circle");
      circle.attr("fill", shape.color);
      circle.attr("r", TILE_WIDTH / 2);
      circle.attr("cy", ( tile[0] + 0.5 ) * TILE_HEIGHT);
      circle.attr("cx", ( tile[1] + 0.5 ) * TILE_WIDTH);
    });
  }

  function renderChart(chart){
    var
      svg = d3.select(chartsBox).append("svg"),
      width = chart.width * TILE_WIDTH,
      height = chart.height * TILE_HEIGHT,
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
  }

  subscribe("plot", renderCharts);

});
