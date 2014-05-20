within("projetmedea.fr", function() {
  var
    no = this.no,
    forEach = this.forEach;

  function preventFormSubmission(form) {
    form.onsubmit = function(){
      return false; // prevent submission to server (reloads the page)
    };
  }

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

  this.preventFormSubmission = preventFormSubmission;
  this.getSelectedOption = getSelectedOption;
  this.setOptionText = setOptionText;
  this.hideOption = this.hideElement;
  this.showOption = this.showElement;
});
