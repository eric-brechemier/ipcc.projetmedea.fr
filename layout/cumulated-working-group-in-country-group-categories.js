within("projetmedea.fr", function(publish, subscribe, get){
  var
    mapData = this.mapData,
    getWorkingGroupLayout = this.getWorkingGroupLayout;

  publish("layout/cumulated-working-group-in-country-group-categories",function(){
    var
      countryGroups = get("country-group-categories");

    return [
      ["charts"],
      mapData(countryGroups, function(countryGroupName){

        function getGroupName( workingGroupName ) {
          return countryGroupName + ' - ' + workingGroupName;
        }

        return getWorkingGroupLayout(
          countryGroupName,
          getGroupName
        );
      })
    ];
  });
});
