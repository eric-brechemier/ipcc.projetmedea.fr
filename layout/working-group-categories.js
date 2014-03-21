within("projetmedea.fr", function(publish){
  publish("layout/working-group-categories",function(){
    return [
      ["chart","width"],
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
                  name: 'WG1',
                  shape: 'circle',
                  valign: 'bottom',
                  align: 'right',
                  color: '#FF0000'
                },
                {
                  name: 'WG1+3',
                  shape: 'vline',
                  valign: 'middle',
                  align: 'center',
                  color: '#FF00FF'
                }
              ],
              ["row2",
                {
                  name: 'WG1+2',
                  shape: 'line',
                  valign: 'middle',
                  align: 'center',
                  color: '#FFFF00'
                },
                {
                  name: 'WG1+2+3',
                  shape: 'circle',
                  valign: 'middle',
                  align: 'center',
                  color: '#FFFFFF'
                }
              ],
              ["row3",
                {
                  name: 'WG2',
                  shape: 'circle',
                  valign: 'top',
                  align: 'right',
                  color: '#00FF00'
                },
                {
                  name: 'WG2+3',
                  shape: 'vline',
                  valign: 'middle',
                  align: 'center',
                  color: '#00FFFF'
                }
              ]
            ],
            [
              ["table-layout", "column3"],
              ["row1+2+3",
                {
                  name: 'WG3',
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
  });
});
