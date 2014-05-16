within("projetmedea.fr", function(publish, subscribe, get){

  var
    no = this.no,
    percentage = this.percentage,
    count = this.countData;

  function displayPercentage(){
    var
      selectedAuthors = get('selected-authors'),
      authors = get('authors');

    if ( no(selectedAuthors) || no(authors) ) {
      return;
    }

    document
      .getElementById('selected-records-percentage')
      .innerHTML = percentage( count(selectedAuthors), count(authors) );
  }

  subscribe("authors", displayPercentage);
  subscribe("selected-authors", displayPercentage);
});
