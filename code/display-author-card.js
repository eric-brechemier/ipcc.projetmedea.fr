within("projetmedea.fr", function(publish, subscribe) {
  var
    // addClass = this.addClass,
    // removeClass = this.removeClass,

    showElement = this.showElement,
    hideElement = this.hideElement,

    authorCard = document.getElementById( 'author-card' ),

    // margin between a tile and the top of the card, in pixels
    CARD_TOP_MARGIN = 20;

  function getTopPosition( node ) {
    var boundingBox = node.getBoundingClientRect();
    // the bounding box is relative to the viewport, not the page
    return window.pageYOffset + boundingBox.top;
  }

  function setTopPosition( node, topPosition ) {
    node.style.top = topPosition + "px";
  }

  function showAuthorCard( tileNode ) {
    setTopPosition(
      authorCard,
      getTopPosition( tileNode ) + CARD_TOP_MARGIN
    );

    // TODO: define CSS3 fadeIn transition
    // addClass( authorCard, 'fade-in' );
    showElement( authorCard );
  }

  function hideAuthorCard() {
    // TODO: define CSS3 fadeOut transition
    // addClass( authorCard, 'fade-out' );
    hideElement( authorCard );
  }

  subscribe("over-tile", showAuthorCard);
  subscribe("out-of-tile", hideAuthorCard);
});
