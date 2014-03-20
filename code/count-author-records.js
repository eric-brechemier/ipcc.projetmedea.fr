within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.count;

  subscribe("authors", function(authors){
    document
      .getElementById('total-records-count')
      .innerHTML = count(authors);
  });
});
