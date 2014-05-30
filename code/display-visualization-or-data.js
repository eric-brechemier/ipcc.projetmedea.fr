within("projetmedea.fr", function() {
  var
    showElement = this.showElement,
    hideElement = this.hideElement,

    visualizationBlock =
      document.getElementById( 'visualization-block' ),
    dataBlock =
      document.getElementById( 'data-block' ),
    showVisualizationButton =
      document.getElementById( 'show-visualization-hide-data' ),
    showDataButton =
      document.getElementById( 'show-data-hide-visualization' ),

    SELECTED_BUTTON_CLASS = 'selected-text';

  function disableAndSelectButton( button ) {
    button.disabled = true;
    button.className = SELECTED_BUTTON_CLASS;
  }

  function enableAndUnselectButton( button ) {
    button.disabled = false;
    button.className = '';
  }

  function showVisualizationHideData() {
    showElement( visualizationBlock );
    hideElement( dataBlock );
    disableAndSelectButton( showVisualizationButton );
    enableAndUnselectButton( showDataButton );
  }

  function showDataHideVisualization() {
    showElement( dataBlock );
    hideElement( visualizationBlock );
    disableAndSelectButton( showDataButton );
    enableAndUnselectButton( showVisualizationButton );
  }

  showVisualizationButton.onclick = showVisualizationHideData;
  showDataButton.onclick = showDataHideVisualization;
});
