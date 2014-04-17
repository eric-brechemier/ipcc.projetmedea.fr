within("projetmedea.fr", function(publish, subscribe, get){
  var
    map = this.map,
    or = this.or;

  function getRoleLayout(getGroupName, title, subtitle) {
    subtitle = or( subtitle, "" );
    return [
      ["chart","width",title,subtitle],
      ["height",
        [
          ["table-layout","column1+2+3"],
          ["row1",
            [
              ["table-layout", "column1+2+3"],
              ["row1",
                {
                  name: getGroupName('Contributing Author'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#FF0000'
                }
              ]
            ]
          ],
          ["row2",
            [
              ["table-layout", "column1", "column2", "column3"],
              ["row2",
                {
                  name: getGroupName('Coordinating Lead Author'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#FF00FF'
                },
                {
                  name: getGroupName('Multiple Roles'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#000000'
                },
                {
                  name: getGroupName('Review Editor'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#00FF00'
                }
              ]
            ]
          ],
          ["row3",
            [
              ["table-layout", "column1+2+3"],
              ["row3",
                {
                  name: getGroupName('Lead Author'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#0000FF'
                }
              ]
            ]
          ]
        ]
      ]
    ];
  }

  publish("layout/cumulated-role-in-assessment-report-categories",function(){
    var
      assessmentReports = get("assessment-reports/names"),
      assessmentReportYears = get("assessment-reports/years");

    return [
      ["charts"],
      map(assessmentReports, function(ar,arPosition){
        var
          year = assessmentReportYears[arPosition];

        function getGroupName( roleName ) {
          return ar + ' - ' + roleName;
        }

        return getRoleLayout(getGroupName, ar, year);
      })
    ];
  });

  this.getRoleLayout = getRoleLayout;
});
