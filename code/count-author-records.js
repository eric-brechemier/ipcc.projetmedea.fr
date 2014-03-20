within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData;

  subscribe("authors", function(authors){
    document
      .getElementById('total-records-count')
      .innerHTML = count(authors);
  });
});
