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
          year = assessmentReportYears[arPosition],
          groupNames = {
            'WG1': ar + ' WG1',
            'WG1+2': ar + ' WG1+2',
            'WG1+3': ar + ' WG1+3',
            'WG1+2+3': ar + ' WG1+2+3',
            'WG2': ar + ' WG2',
            'WG2+3': ar + ' WG2+3',
            'WG3': ar + ' WG3'
          };
        return getWorkingGroupLayout(ar, year, groupNames);
      })
    ];
  });
});
