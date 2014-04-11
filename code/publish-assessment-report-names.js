within("projetmedea.fr", function(publish, subscribe) {
  var
    getDataColumn = this.getDataColumn,

    ASSESSMENT_REPORT_NAME = 0;

  subscribe("assessment-report-years", function(data) {
    publish(
      "assessment-reports/names",
      getDataColumn(data, ASSESSMENT_REPORT_NAME)
    );
  });

});
