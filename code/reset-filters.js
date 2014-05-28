within("projetmedea.fr", function(publish, subscribe) {
  var
    hideElement = this.hideElement,
    showElement = this.showElement,
    PREVENT_DEFAULT = this.PREVENT_DEFAULT,

    resetButton = document.getElementById( 'reset-filters' ),
    resetButtonBlock = document.getElementById( 'reset-filters-block' );

  resetButton.onclick = function() {
    publish( "reset-filters" );
    return PREVENT_DEFAULT;
  };

  subscribe("are-all-authors-selected", function( areAllAuthorsSelected ) {
    if ( areAllAuthorsSelected ) {
      hideElement( resetButtonBlock );
    } else {
      showElement( resetButtonBlock );
    }
  });
});
