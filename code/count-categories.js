within("projetmedea.fr", function(publish, subscribe){

  subscribe("categories", function(categories){
    document
      .getElementById('total-categories-count')
      .innerHTML = categories.length - 1; // do not count header row
  });
});
