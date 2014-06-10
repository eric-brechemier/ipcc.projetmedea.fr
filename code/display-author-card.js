within("projetmedea.fr", function(publish, subscribe) {
  var
    // addClass = this.addClass,
    // removeClass = this.removeClass,

    showElement = this.showElement,
    hideElement = this.hideElement,

    authorCard = document.getElementById( 'author-card' );

  function showAuthorCard() {
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
