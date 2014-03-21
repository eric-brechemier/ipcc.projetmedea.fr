within("projetmedea.fr", function(publish, subscribe, get){

  function selectLayout(category){
    publish("group-layout", get("layout/"+category)() );
  }

  subscribe("group-by", selectLayout);
});
