within("projetmedea.fr", function() {
  var
    no = this.no,
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

  function setOptionText( option, text ) {
    var textNode = option.firstChild;
    if ( no(textNode) ) {
      textNode = document.createTextNode(text);
      option.appendChild(textNode);
    } else {
      textNode.nodeValue = text;
    }
  }

  this.getSelectedOption = getSelectedOption;
  this.setOptionText = setOptionText;
});
