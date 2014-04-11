within("projetmedea.fr", function(publish, subscribe, get){
  var
    map = this.map;

  publish("layout/cumulated-working-group-in-assessment-report-categories",function(){
    var
      assessmentReports = get("assessment-reports/names"),
      assessmentReportYears = get("assessment-reports/years");
    return [
      ["charts"],
      map(assessmentReports, function(ar,arPosition){
        var year = assessmentReportYears[arPosition];
        return [
          ["chart","width",ar,year],
          ["height",
            [
              ["table-layout","column1+2","column3"],
              ["row1+2+3",
                [
                  ["table-layout",
                    "column1",
                    "column2"
                  ],
                  ["row1",
                    {
                      name: ar + ' WG1',
                      shape: 'circle',
                      valign: 'bottom',
                      align: 'right',
                      color: '#FF0000'
                    },
                    {
                      name: ar + ' WG1+3',
                      shape: 'circle',
                      valign: 'bottom',
                      align: 'center',
                      color: '#FF00FF'
                    }
                  ],
                  ["row2",
                    {
                      name: ar + ' WG1+2',
                      shape: 'circle',
                      valign: 'middle',
                      align: 'center',
                      color: '#CCCC00'
                    },
                    {
                      name: ar + ' WG1+2+3',
                      shape: 'circle',
                      valign: 'middle',
                      align: 'center',
                      color: '#000000'
                    }
                  ],
                  ["row3",
                    {
                      name: ar + ' WG2',
                      shape: 'circle',
                      valign: 'top',
                      align: 'right',
                      color: '#00FF00'
                    },
                    {
                      name: ar + ' WG2+3',
                      shape: 'circle',
                      valign: 'top',
                      align: 'center',
                      color: '#00FFFF'
                    }
                  ]
                ],
                [
                  ["table-layout", "column3"],
                  ["row1+2+3",
                    {
                      name: ar + ' WG3',
                      shape: 'circle',
                      valign: 'middle',
                      align: 'left',
                      color: '#0000FF'
                    }
                  ]
                ]
              ]
            ]
          ]
        ];
      })
    ];
  });
});
