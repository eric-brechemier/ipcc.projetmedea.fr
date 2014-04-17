within("projetmedea.fr", function() {
  var
    or = this.or;

  function getSingleGroupLayout(groupName, heading, subheading) {
    heading = or(heading, groupName);
    subheading = or(subheading, "");

    return [
      ["chart","width",heading,subheading],
      ["height",
        {
          name: groupName,
          shape: 'circle',
          valign: 'middle',
          align: 'center',
          color: '#FF0000'
        }
      ]
    ];
  }

  this.getSingleGroupLayout = getSingleGroupLayout;
});
