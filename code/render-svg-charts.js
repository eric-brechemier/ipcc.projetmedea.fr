within("projetmedea.fr", function(publish, subscribe, get){

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

    // offset of the top position of a tile, in tiles, in a tile record
    TILE_TOP = 0,
    // offset of the left position of a tile, in tiles, in a tile record
    TILE_LEFT = 1,

    // size of a tile in pixels
    TILE_WIDTH = 6,
    TILE_HEIGHT = 6,

    // radius of the circle drawn in a tile
    CIRCLE_RADIUS = 1.5;

  function drawShape(group, shape){
    forEach(shape.tiles, function( tilePosition ){
      var
        tileTop = tilePosition[TILE_TOP],
        tileLeft = tilePosition[TILE_LEFT],

        tile = group.append("g"),
        tileNode = tile.node(),

        boundingBox = tile.append("rect"),
        boundingBoxTop = tileTop * TILE_HEIGHT,
        boundingBoxLeft = tileLeft * TILE_WIDTH,

        circle = tile.append("circle"),
        centerTop = ( tileTop + 0.5 ) * TILE_HEIGHT,
        centerLeft = ( tileLeft + 0.5 ) * TILE_WIDTH;

      boundingBox.attr("x", boundingBoxLeft);
      boundingBox.attr("y", boundingBoxTop);
      boundingBox.attr("width", TILE_WIDTH);
      boundingBox.attr("height", TILE_HEIGHT);
      boundingBox.attr("stroke", "transparent");
      boundingBox.attr("fill", "transparent");

      circle.attr("r", CIRCLE_RADIUS);
      circle.attr("cx", centerLeft);
      circle.attr("cy", centerTop);
      circle.attr("stroke", shape.color);
      circle.attr("fill", shape.color);
      circle.attr("class", "tile-circle");

      if ( shape.ring ) {
        circle.attr("fill-opacity", 0);
      } else {
        circle.attr("stroke-width", 0);
      }

      tile.attr("class", "tile");
      tile.append("title").text(shape.name);
      tileNode.onmouseover = function() {
        publish( "over-tile", tileNode );
      };
      tileNode.onmouseout = function() {
        publish( "out-of-tile", tileNode );
      };
    });
  }

  function getChartCssClasses() {
    var groupName = get( 'group-by' );
    return "chart-box " +
      // replace '-categories' suffix with '-chart'
      groupName.replace( /-categories$/, '-chart' );
  }

  function renderChart(chart){
    var
      chartBox = d3.select(chartsBox).append("div"),
      svg = chartBox.append("svg"),
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

    chartBox.attr("class", getChartCssClasses( chart ) );

    svg.attr("width", width);
    svg.attr("height", height);

    background.attr("width", width);
    background.attr("height", height);
    background.attr("fill", CHART_BACKGROUND_COLOR);

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
