within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,

    chartsBox = document.getElementById("svg-charts");

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
      svg = d3.select(chartsBox).append("svg");

    svg.attr("width", chart.width * TILE_WIDTH);
    svg.attr("height", chart.height * TILE_HEIGHT);

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
