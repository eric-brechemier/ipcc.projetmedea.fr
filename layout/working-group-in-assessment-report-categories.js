within("projetmedea.fr", function(publish){
  var map = this.map;

  publish("layout/working-group-in-assessment-report-categories",function(){
    var assessmentReports = ['AR1','AR2','AR3','AR4','AR5'];
    return [
      ["charts"].concat(assessmentReports),
      map(assessmentReports, function(ar){
        return [
          ["chart",ar],
          ["WG",
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
                      color: '#FFFF00'
                    },
                    {
                      name: ar + ' WG1+2+3',
                      shape: 'circle',
                      valign: 'middle',
                      align: 'center',
                      color: '#FFFFFF'
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
                      valign: 'middle',
                      align: 'top',
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
