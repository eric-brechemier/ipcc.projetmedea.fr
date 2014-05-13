within("projetmedea.fr", function(){
  var
    or = this.or,
    forEach = this.forEach,

    CSS_CLASS_HIDDEN = "hidden";

  // Note:
  // In this implementation, all other class names are lost, which could
  // be avoided by adding the class to existing classes instead.
  function hideBlock(block) {
    block.className = CSS_CLASS_HIDDEN;
  }

  // Note:
  // In this implementation, all other class names are lost, which could
  // be avoided by removing the class from existing classes instead.
  function showBlock(block) {
    block.className = "";
  }

  function showHide(blockId, presenterBlockId, showButtonId, hideButtonId){
    presenterBlockId = or(presenterBlockId, blockId+"-presenter");
    showButtonId = or(showButtonId, "show-"+blockId);
    hideButtonId = or(hideButtonId, "hide-"+blockId);

    var
      showButton = document.getElementById(showButtonId),
      hideButton = document.getElementById(hideButtonId),
      presenterBlock = document.getElementById(presenterBlockId),
      codeBlock = document.getElementById(blockId);

    function showCodeBlock(){
      hideBlock(presenterBlock);
      showBlock(codeBlock);
    }

    function hideCodeBlock(){
      showBlock(presenterBlock);
      hideBlock(codeBlock);
    }

    showButton.onclick = showCodeBlock;
    hideButton.onclick = hideCodeBlock;
  }

  function selectBlockToShow( displaySelection ) {

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

    selectDisplay();
    displaySelection.onchange = selectDisplay;
  }

  this.showBlock = showBlock;
  this.hideBlock = hideBlock;
  this.showHide = showHide;
  this.selectBlockToShow = selectBlockToShow;

});
