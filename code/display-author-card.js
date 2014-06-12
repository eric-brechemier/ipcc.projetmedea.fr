within("projetmedea.fr", function(publish, subscribe, get) {
  var
    // addClass = this.addClass,
    // removeClass = this.removeClass,

    showElement = this.showElement,
    hideElement = this.hideElement,
    getElementWidth = this.getElementWidth,
    getAbsolutePosition = this.getAbsolutePosition,
    setAbsolutePosition = this.setAbsolutePosition,
    min = this.min,
    warn = this.warn,

    authorCard = document.getElementById( 'author-card' ),
    authorName = document.getElementById( 'author-card-name' ),
    authorInstitutions =
      document.getElementById( 'author-card-institutions' ),
    authorContributions =
      document.getElementById( 'author-card-contributions' ),

    NBSP = this.NBSP,
    AUTHOR_ID = this.AUTHOR_ID,
    AUTHOR_FIRST_NAME = this.AUTHOR_FIRST_NAME,
    AUTHOR_LAST_NAME = this.AUTHOR_LAST_NAME,

    // margin between a tile and the top of the card, in pixels
    CARD_TOP_MARGIN = 20;

  function findAuthor( authorId ) {
    var
      authors = get( 'authors' ),
      // start at the offset given by the id, but not past last author
      last = authors.length - 1,
      offset = min( Number( authorId ), last ),
      currentAuthor = authors[ offset ],
      currentAuthorId = currentAuthor[ AUTHOR_ID ],
      increment,
      last;

    if ( currentAuthorId === authorId ) {
      // shortcut
      return currentAuthor;
    }

    // move up or down in the list of authors, which is sorted
    if ( currentAuthorId > authorId ) {
      // past expected author, look back
      increment = -1;
      limit = 0;
    } else {
      // before expected author, look forward
      increment = 1;
      limit = last;
    }

    while( currentAuthorId !== authorId && offset !== limit ) {
      offset += increment;
      currentAuthor = authors[ offset ];
      currentAuthorId = currentAuthor[ AUTHOR_ID ];
    }

    return currentAuthor;
  }

  function getFullName( author ) {
    // FIXME: order of first name and last name differs depending on culture
    return author[ AUTHOR_FIRST_NAME ] + NBSP + author[ AUTHOR_LAST_NAME ];
  }

  function showAuthorCard( tileNode ) {
    var
      position = getAbsolutePosition( tileNode ),
      authorId = tileNode.getAttribute( "data-author-id" ),
      author = findAuthor( authorId );

    // TODO: write author details in author card
    authorName.innerHTML = getFullName( author );

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
