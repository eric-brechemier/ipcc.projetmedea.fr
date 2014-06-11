within("projetmedea.fr", function() {
  var
    no = this.no,

    // value to return in DOM0 event handlers to prevent default action
    PREVENT_DEFAULT = false,

    // CSS class defined to apply display:none to DOM elements
    CSS_CLASS_HIDDEN = "hidden";

  function addClass(element, name) {
    var classList = element.classList;
    if ( no( classList ) ) {
      // Note: no check is performed for duplicate class names
      element.className += ' ' + name;
      return;
    }
    classList.add( name );
  }

  function removeClass(element, name) {
    var classList = element.classList;
    if ( no( classList ) ) {
      element.className = element.className.replace(
        new RegExp("(^|\\s+)" + name + "(\\s+|$)", "ig"),
        ''
      );
     return;
    }
    classList.remove( name );
  }

  function hideElement(element) {
    addClass(element, CSS_CLASS_HIDDEN);
  }

  function showElement(element) {
    removeClass(element, CSS_CLASS_HIDDEN);
  }

  // Note: the width of elements hidden with display:none is 0
  function getElementWidth( element ) {
    return element.clientWidth;
  }

  function getAbsolutePosition( node ) {
    var boundingBox = node.getBoundingClientRect();
    return {
      // the bounding box is relative to the viewport, not the page
      top: window.pageYOffset + boundingBox.top,
      left: window.pageXOffset + boundingBox.left
    };
  }

  function setAbsolutePosition( node, position ) {
    var
      style = node.style,
      PIXELS = "px";

    style.top = position.top + PIXELS;
    style.left = position.left + PIXELS;
  }

  this.PREVENT_DEFAULT = PREVENT_DEFAULT;
  this.addClass = addClass;
  this.removeClass = removeClass;
  this.hideElement = hideElement;
  this.showElement = showElement;
  this.getElementWidth = getElementWidth;
  this.getAbsolutePosition = getAbsolutePosition;
  this.setAbsolutePosition = setAbsolutePosition;
});
