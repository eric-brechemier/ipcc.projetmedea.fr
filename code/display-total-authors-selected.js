within("projetmedea.fr", function(publish, subscribe, get){

  subscribe("total-authors-selected", function(totalAuthorsSelected){
    document
      .getElementById('selected-records-count')
      .innerHTML = totalAuthorsSelected;
  });

  subscribe("percentage-authors-selected", function(percentageSelected){
    document
      .getElementById('selected-records-percentage')
      .innerHTML = percentageSelected;
  });

});
