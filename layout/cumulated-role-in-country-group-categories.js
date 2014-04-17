within("projetmedea.fr", function(publish, subscribe, get){
  var
    mapData = this.mapData,
    getRoleLayout = this.getRoleLayout;

  publish("layout/cumulated-role-in-country-group-categories",function(){
    var
      countryGroups = get("country-group-categories");

    return [
      ["charts"],
      mapData(countryGroups, function(countryGroupName){

        function getGroupName( roleName ) {
          return countryGroupName + ' - ' + roleName;
        }

        return getRoleLayout(
          getGroupName,
          countryGroupName
        );
      })
    ];
  });
});
