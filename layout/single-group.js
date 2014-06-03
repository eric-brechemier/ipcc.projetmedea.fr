within("projetmedea.fr", function() {
  var
    or = this.or;

  function getSingleGroupLayout(groupName, heading) {
    heading = or(heading, groupName);

    return [
      ["chart","width",heading,"subheading"],
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
