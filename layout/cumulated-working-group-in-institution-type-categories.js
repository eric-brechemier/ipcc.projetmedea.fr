within("projetmedea.fr", function(publish, subscribe, get){
  var
    mapData = this.mapData,
    getWorkingGroupLayout = this.getWorkingGroupLayout,

    CATEGORY_NAME = 0;

  publish("layout/cumulated-working-group-in-institution-type-categories",function(){
    var
      institutionTypes = get("institution-type-categories"),
      subtitle = "";

    return [
      ["charts"],
      mapData(institutionTypes, function(institutionTypeName){

        function getGroupName( workingGroupName ) {
          return institutionTypeName + ' - ' + workingGroupName;
        }

        return getWorkingGroupLayout(
          institutionTypeName,
          subtitle,
          getGroupName
        );
      })
    ];
  });
});
