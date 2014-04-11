within("projetmedea.fr", function(publish, subscribe) {
  var
    getDataColumn = this.getDataColumn,

    ASSESSMENT_REPORT_YEAR = 1;

  subscribe("assessment-report-years", function(data) {
    publish(
      "assessment-reports/years",
      getDataColumn(data, ASSESSMENT_REPORT_YEAR)
    );
  });

});
