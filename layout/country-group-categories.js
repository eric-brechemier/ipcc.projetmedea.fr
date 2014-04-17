within("projetmedea.fr", function(publish, subscribe, get){
  var
    mapData = this.mapData,
    getSingleGroupLayout = this.getSingleGroupLayout;

  publish("layout/country-group-categories",function(){
    var
      countryGroups = get("country-group-categories");

    return [
      ["charts"],
      mapData(countryGroups, function(countryGroupName){
        return getSingleGroupLayout(countryGroupName);
      })
    ];
  });
});
