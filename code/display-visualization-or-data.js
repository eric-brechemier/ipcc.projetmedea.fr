within("projetmedea.fr", function() {

  var
    forEach = this.forEach,
    showBlock = this.showBlock,
    hideBlock = this.hideBlock,
    displaySelection = document.getElementById("display-selection");

  function selectDisplay() {
    var
      selectedValue = displaySelection.value,
      // WARNING: no text must be left between options in markup
      // like in following example
      // <select ...
      //   ><option ... >...</option
      //   ><option ... >...</option
      // ></select>
      options = displaySelection.childNodes;

    forEach(options, function(option) {
      var
        value = option.value,
        block = document.getElementById(value);

      if ( value === selectedValue ) {
        showBlock(block);
      } else {
        hideBlock(block);
      }
    });
  }

  displaySelection.onchange = selectDisplay;

});
