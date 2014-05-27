within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,
    max = this.max,

    chartsBox = document.getElementById("svg-charts"),

    CHART_BACKGROUND_COLOR = "white",

    // margins around the chart, in tiles
    TOP_MARGIN = 1,
    BOTTOM_MARGIN = 1,
    LEFT_MARGIN = 1,
    RIGHT_MARGIN = 1,

    // margin between chart and shapes, in tiles
    HEADING_MARGIN = 1,

    // line height of the chart heading and subheading, in pixels
    CHART_HEADING_LINE_HEIGHT = 20,
    CHART_SUBHEADING_LINE_HEIGHT = 20,

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
      var
        circle = g.append("circle"),
        centerTop = ( tile[0] + 0.5 ) * TILE_HEIGHT,
        centerLeft = ( tile[1] + 0.5 ) * TILE_WIDTH;
      circle.attr("r", CIRCLE_RADIUS);
      circle.attr("cx", centerLeft);
      circle.attr("cy", centerTop);
    });
  }

  function renderChart(chart){
    var
      svg = d3.select(chartsBox).append("svg"),
      background = svg.append("rect"),
      chartGroup = svg.append("g"),
      heading = svg.append("text"),
      subheading = svg.append("text"),
      width,
      halfWidth,
      height,
      headingTop,
      headingBaselineY,
      subheadingBaselineY;

    heading.text(chart.heading);
    subheading.text(chart.subheading);

    width = (
      LEFT_MARGIN +
      chart.width +
      RIGHT_MARGIN
    ) * TILE_WIDTH;

    headingTop = (
      TOP_MARGIN +
      chart.height +
      HEADING_MARGIN
    ) * TILE_HEIGHT;

    height =
      headingTop +
      CHART_HEADING_LINE_HEIGHT +
      CHART_SUBHEADING_LINE_HEIGHT +
      BOTTOM_MARGIN * TILE_HEIGHT;

    // increase chart width to ensure that the heading and subheading fit
    width = max( width, heading.node().getComputedTextLength() );
    width = max( width, subheading.node().getComputedTextLength() );
    halfWidth = width / 2;

    chartGroup.attr("transform",
      "translate(" +
      ( halfWidth - chart.width * TILE_WIDTH / 2 ) +
      "," +
      TOP_MARGIN +
      ")"
    );

    heading.attr("text-anchor", "middle");
    heading.attr("x", halfWidth);
    subheading.attr("text-anchor", "middle");
    subheading.attr("x", halfWidth);

    headingBaselineY = headingTop + CHART_HEADING_LINE_HEIGHT;
    heading.attr("y", headingBaselineY);

    subheadingBaselineY = headingBaselineY + CHART_SUBHEADING_LINE_HEIGHT;
    subheading.attr("y", subheadingBaselineY);

    svg.attr("width", width);
    svg.attr("height", height);

    background.attr("width", width);
    background.attr("height", height);
    background.attr("fill", CHART_BACKGROUND_COLOR);

    // TODO: keep the chart centered in the larger width
    forEach(chart.shapes, function(shape){
      drawShape(chartGroup, shape);
    });
  }

  function renderCharts(charts){
    chartsBox.innerHTML = "";
    forEach(charts, renderChart);
    publish("svg-rendered", chartsBox.innerHTML);
  }

  subscribe("plot", renderCharts);

});
