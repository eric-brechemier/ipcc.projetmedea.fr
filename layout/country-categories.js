within("projetmedea.fr", function(publish, subscribe, get){
  var
    mapData = this.mapData,
    getSingleGroupLayout = this.getSingleGroupLayout;

  publish("layout/country-categories",function(){
    var
      countries = get("country-categories");

    return [
      ["charts"],
      mapData(countries, function(countryName){
        return getSingleGroupLayout(countryName);
      })
    ];
  });
});
