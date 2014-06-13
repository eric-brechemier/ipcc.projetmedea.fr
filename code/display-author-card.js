within("projetmedea.fr", function(publish, subscribe, get) {
  var
    // addClass = this.addClass,
    // removeClass = this.removeClass,

    showElement = this.showElement,
    hideElement = this.hideElement,
    getElementWidth = this.getElementWidth,
    getAbsolutePosition = this.getAbsolutePosition,
    setAbsolutePosition = this.setAbsolutePosition,
    find = this.find,
    reduce = this.reduce,
    min = this.min,
    warn = this.warn,

    authorCard = document.getElementById( 'author-card' ),
    groupName = document.getElementById( 'author-card-group-name' ),
    authorName = document.getElementById( 'author-card-name' ),
    authorInstitutions =
      document.getElementById( 'author-card-institutions' ),
    authorContributions =
      document.getElementById( 'author-card-contributions' ),

    NBSP = this.NBSP,
    AUTHOR_ID = this.AUTHOR_ID,
    AUTHOR_FIRST_NAME = this.AUTHOR_FIRST_NAME,
    AUTHOR_LAST_NAME = this.AUTHOR_LAST_NAME,
    AUTHOR_CONTRIBUTIONS = this.AUTHOR_CONTRIBUTIONS,

    CONTRIBUTION_SEPARATOR = this.CONTRIBUTION_SEPARATOR,
    CONTRIBUTION_ASSESSMENT_REPORT = this.CONTRIBUTION_ASSESSMENT_REPORT,
    CONTRIBUTION_WORKING_GROUP = this.CONTRIBUTION_WORKING_GROUP,
    CONTRIBUTION_ROLE = this.CONTRIBUTION_ROLE,
    CONTRIBUTION_COUNTRY = this.CONTRIBUTION_COUNTRY,
    CONTRIBUTION_INSTITUTION = this.CONTRIBUTION_INSTITUTION,

    LIST_ITEM_NAME = this.LIST_ITEM_NAME,
    LIST_ITEM_VALUE = this.LIST_ITEM_VALUE,

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

  function getContributionRecord( contributionString ) {
    return contributionString.split( CONTRIBUTION_SEPARATOR );
  }

  function getListItemName( listName, itemValue ) {
    var
      list = get( listName ),
      listItem = find( list, function( item ) {
        return item[ LIST_ITEM_VALUE ] === itemValue;
      });
    return listItem[ LIST_ITEM_NAME ];
  }

  function getListItemValue( listName, itemName ) {
    var
      list = get( listName ),
      listItem = find( list, function( item ) {
        return item[ LIST_ITEM_NAME ] === itemName;
      });
    return listItem[ LIST_ITEM_VALUE ];
  }

  function getInstitutionName( contributionRecord ) {
    var institutionId = contributionRecord[ CONTRIBUTION_INSTITUTION ];
    return getListItemName( 'institution-list', institutionId );
  }

  function getCountryName( contributionRecord ) {
    var countryId = contributionRecord[ CONTRIBUTION_COUNTRY ];
    return getListItemName( 'country-list', countryId );
  }

  function getYear( contributionRecord ) {
    var
      assessmentReport = 'AR' + contributionRecord[ CONTRIBUTION_ASSESSMENT_REPORT ];
    return getListItemValue( 'assessment-report-years', assessmentReport );
  }

  function getWorkingGroup( contributionRecord ) {
    var workingGroup = contributionRecord[ CONTRIBUTION_WORKING_GROUP ];
    return 'WG' + workingGroup;
  }

  function getChapter( contributionRecord ) {
    return 'CH';
  }

  function getRole( contributionRecord ) {
    var roleId = contributionRecord[ CONTRIBUTION_ROLE ];
    return getListItemName( 'role-list', roleId );
  }

  function getInstitutions( author ) {
    var
      contributions = author[ AUTHOR_CONTRIBUTIONS ],
      // map of display strings => true, to detect duplicates
      items = {};

    return reduce( '', contributions, function( accumulator, contribution ) {
      var
        contributionRecord = getContributionRecord( contribution ),
        item =
          '<li>' +
          getInstitutionName( contributionRecord ) +
          NBSP +
          '(' +
          getCountryName( contributionRecord ) +
          ')' +
          '</li>';

      if ( items.hasOwnProperty( item ) ) {
        // skip duplicate entry
        item = '';
      } else {
        items[ item ] = true;
      }

      return accumulator + item;
    });
  }

  function getContributions( author ) {
    var contributions = author[ AUTHOR_CONTRIBUTIONS ];
    return reduce( '', contributions, function( accumulator, contribution ) {
      var contributionRecord = getContributionRecord( contribution );
      return (
        accumulator +
        '<tr>' +
          '<td>' + getYear( contributionRecord ) + '</td>' +
          '<td>' + getWorkingGroup( contributionRecord ) + '</td>' +
          //'<td>' + getChapter( contributionRecord ) + '</td>' +
          '<td>' + getRole( contributionRecord ) + '</td>' +
        '</tr>'
      );
    });
  }

  function showAuthorCard( tileNode ) {
    var
      position = getAbsolutePosition( tileNode ),
      authorId = tileNode.getAttribute( "data-author-id" ),
      author = findAuthor( authorId );

    groupName.innerHTML =
      NBSP + tileNode.getAttribute( "data-group-name" );
    groupName.style.backgroundColor =
      tileNode.getAttribute( "data-group-color" );
    authorName.innerHTML = getFullName( author );
    authorInstitutions.innerHTML = getInstitutions( author );
    authorContributions.innerHTML = getContributions( author );

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
