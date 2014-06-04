within("projetmedea.fr", function(publish, subscribe) {
  var
    showElement = this.showElement,
    hideElement = this.hideElement,

    authorCard = document.getElementById( 'author-card' );

  function showAuthorCard() {
    showElement( authorCard );
  }

  function hideAuthorCard() {
    hideElement( authorCard );
  }

  subscribe("over-tile", showAuthorCard);
  subscribe("out-of-tile", hideAuthorCard);
});
