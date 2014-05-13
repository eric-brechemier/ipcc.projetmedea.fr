within("projetmedea.fr", function() {
  var
    forEach = this.forEach;

  function getSelectedOption(select){
    var
      options = select.childNodes,
      selectedOption = null;
    forEach(options, function(option){
      if ( option.selected ){
        selectedOption = option;
        return true;
      }
    });
    return selectedOption;
  }

  this.getSelectedOption = getSelectedOption;
});
