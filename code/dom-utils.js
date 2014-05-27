within("projetmedea.fr", function() {
  var
    // value to return in DOM0 event handlers to prevent default action
    PREVENT_DEFAULT = false,

    // CSS class defined to apply display:none to DOM elements
    CSS_CLASS_HIDDEN = "hidden";

  // Note:
  // In this implementation, all other class names are lost, which could
  // be avoided by adding the class to existing classes instead.
  function hideElement(element) {
    element.className = CSS_CLASS_HIDDEN;
  }

  // Note:
  // In this implementation, all other class names are lost, which could
  // be avoided by removing the class from existing classes instead.
  function showElement(element) {
    element.className = "";
  }

  this.hideElement = hideElement;
  this.showElement = showElement;
});
