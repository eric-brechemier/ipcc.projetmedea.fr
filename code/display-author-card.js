within("projetmedea.fr", function(publish, subscribe) {
  var
    // addClass = this.addClass,
    // removeClass = this.removeClass,

    showElement = this.showElement,
    hideElement = this.hideElement,

    authorCard = document.getElementById( 'author-card' ),

    // margin between a tile and the top of the card, in pixels
    CARD_TOP_MARGIN = 20;

  // Note: the width of elements hidden with display:none is 0
  function getElementWidth( element ) {
    return element.clientWidth;
  }

  function getAbsolutePosition( node ) {
    var boundingBox = node.getBoundingClientRect();
    return {
      // the bounding box is relative to the viewport, not the page
      top: window.pageYOffset + boundingBox.top,
      left: window.pageXOffset + boundingBox.left
    };
  }

  function setAbsolutePosition( node, position ) {
    var
      style = node.style,
      PIXELS = "px";

    style.top = position.top + PIXELS;
    style.left = position.left + PIXELS;
  }

  function showAuthorCard( tileNode ) {
    var
      position = getAbsolutePosition( tileNode ),
      authorId = tileNode.getAttribute( "data-author-id" );

    // TODO: find author record (start at given offset, and look up/down)
    // TODO: write author details in author card

    // TODO: define CSS3 fadeIn transition
    // addClass( authorCard, 'fade-in' );
    showElement( authorCard );

    position.top += CARD_TOP_MARGIN;
    position.left -= getElementWidth( authorCard ) / 2;
    setAbsolutePosition( authorCard, position );
  }

  function hideAuthorCard() {
    // TODO: define CSS3 fadeOut transition
    // addClass( authorCard, 'fade-out' );
    hideElement( authorCard );
  }

  subscribe("over-tile", showAuthorCard);
  subscribe("out-of-tile", hideAuthorCard);
});
