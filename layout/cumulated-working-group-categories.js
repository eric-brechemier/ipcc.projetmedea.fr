within("projetmedea.fr", function(publish, subscribe, get){
  var
    or = this.or,
    identity = this.identity,

    // separator between years in subheading of the chart
    YEAR_SEPARATOR = " - ";

  function getWorkingGroupLayout(title, getGroupName) {
    getGroupName = or( getGroupName, identity );
    return [
      ["chart","width",title,"subheading"],
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
                  name: getGroupName('WG1'),
                  shape: 'circle',
                  valign: 'bottom',
                  align: 'right',
                  color: '#3CC'
                },
                {
                  name: getGroupName('WG1+3'),
                  shape: 'circle',
                  valign: 'bottom',
                  align: 'center',
                  color: '#3C3',
                  ring: true
                }
              ],
              ["row2",
                {
                  name: getGroupName('WG1+2'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#33C',
                  ring: true
                },
                {
                  name: getGroupName('WG1+2+3'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#FF0000',
                  ring: true
                }
              ],
              ["row3",
                {
                  name: getGroupName('WG2'),
                  shape: 'circle',
                  valign: 'top',
                  align: 'right',
                  color: '#C3C'
                },
                {
                  name: getGroupName('WG2+3'),
                  shape: 'circle',
                  valign: 'top',
                  align: 'center',
                  color: '#C33',
                  ring: true
                }
              ]
            ],
            [
              ["table-layout", "column3"],
              ["row1+2+3",
                {
                  name: getGroupName('WG3'),
                  shape: 'circle',
                  valign: 'middle',
                  align: 'left',
                  color: '#CC3'
                }
              ]
            ]
          ]
        ]
      ]
    ];
  }

  publish("layout/cumulated-working-group-categories",function(){
    var
      years = or(get("assessment-reports/years"), []),
      allYears = years.join(YEAR_SEPARATOR),
      title = 'Any of All AR (' + allYears + ')';
    return getWorkingGroupLayout( title );
  });

  this.getWorkingGroupLayout = getWorkingGroupLayout;
});
