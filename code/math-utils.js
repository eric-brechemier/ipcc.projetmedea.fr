within("projetmedea.fr", function() {
  var
    bind = this.bind;

  // Compute the percentage that the part represents in the whole
  function percentage(part, whole){
    var percents = part / whole * 100;
    if ( percents < 1 ){
      // round to .01%
      return Math.round(percents * 100) / 100;
    } else {
      return Math.round(percents);
    }
  }

  this.percentage = percentage;
  this.max = bind( Math.max, Math );
});
