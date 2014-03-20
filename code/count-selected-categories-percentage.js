within("projetmedea.fr", function(publish, subscribe, get){
  var
    no = this.no,
    percentage = this.percentage,
    count = this.countData;

  function displayPercentage(){
    var
      categories = get('categories'),
      selectedCategories = get('selected-categories');

    if ( no(categories) || no(selectedCategories) ) {
      return;
    }

    document
      .getElementById('selected-categories-percentage')
      .innerHTML = percentage( count(selectedCategories), count(categories) );
  }

  subscribe("categories", displayPercentage);
  subscribe("selected-categories", displayPercentage);

});
