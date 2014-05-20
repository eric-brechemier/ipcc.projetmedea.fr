within("projetmedea.fr", function(publish, subscribe){

  subscribe("total-authors", function(totalAuthors){
    document
      .getElementById('total-records-count')
      .innerHTML = totalAuthors;
  });
});
