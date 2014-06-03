within("projetmedea.fr", function(publish, subscribe, get){
  var
    map = this.map,
    or = this.or;

  function getRoleLayout(getGroupName, title) {
    return [
      ["chart","width",title,"subheading"],
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
                  color: '#B40097'
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
                  color: '#C0F400'
                },
                {
                  name: getGroupName('Multiple Roles'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#FF0000',
                  ring: true
                },
                {
                  name: getGroupName('Review Editor'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#0D58A6'
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
                  color: '#FF9900'
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
          year = assessmentReportYears[arPosition],
          title = ar + ' (' + year + ')';

        function getGroupName( roleName ) {
          return ar + ' - ' + roleName;
        }

        return getRoleLayout(getGroupName, title);
      })
    ];
  });

  this.getRoleLayout = getRoleLayout;
});
