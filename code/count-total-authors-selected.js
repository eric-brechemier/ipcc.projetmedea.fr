within("projetmedea.fr", function(publish, subscribe, get){
  var
    no = this.no,
    count = this.countData,
    percentage = this.percentage;

  function countSelectedAuthors() {
    var
      selectedAuthors = get("selected-authors"),
      totalAuthors = get("total-authors"),
      totalAuthorsSelected,
      percentageAuthorsSelected;

    if ( no(selectedAuthors) || no(totalAuthors) ) {
      return;
    }

    totalAuthorsSelected = count(selectedAuthors);
    publish("total-authors-selected", totalAuthorsSelected);
    percentageAuthorsSelected =
      percentage(totalAuthorsSelected, totalAuthors);
    publish("percentage-authors-selected", percentageAuthorsSelected);
  }

  subscribe("selected-authors", countSelectedAuthors);
  subscribe("total-authors", countSelectedAuthors);
});
