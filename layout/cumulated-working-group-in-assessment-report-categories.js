within("projetmedea.fr", function(publish, subscribe, get){
  var
    map = this.map,
    getWorkingGroupLayout = this.getWorkingGroupLayout;

  publish("layout/cumulated-working-group-in-assessment-report-categories",function(){
    var
      assessmentReports = get("assessment-reports/names"),
      assessmentReportYears = get("assessment-reports/years");

    return [
      ["charts"],
      map(assessmentReports, function(ar,arPosition){
        var
          year = assessmentReportYears[arPosition];

        function getGroupName( workingGroupName ) {
          return ar + ' ' + workingGroupName;
        }

        return getWorkingGroupLayout(ar, year, getGroupName);
      })
    ];
  });
});
