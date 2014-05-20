within("projetmedea.fr", function(publish, subscribe){
  var
    count = this.countData;

  subscribe("authors", function(authors){
    publish("total-authors", count(authors) );
  });
});
