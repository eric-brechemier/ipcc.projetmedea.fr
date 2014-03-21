within("projetmedea.fr", function(publish, subscribe, get){

  subscribe("group-by", function(category){
    publish("group-layout", get("layout/"+category) );
  });
});
