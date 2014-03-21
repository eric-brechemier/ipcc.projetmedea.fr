within("projetmedea.fr", function(publish, subscribe, get){

  function resetLayout(){
    var category = get("group-by");
    publish("group-layout", get("layout/"+category)() );
  }

  subscribe("selected-categories", resetLayout);
});
