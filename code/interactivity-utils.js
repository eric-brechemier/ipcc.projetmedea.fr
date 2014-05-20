within("projetmedea.fr", function(){
  var
    or = this.or,
    forEach = this.forEach,
    hideBlock = this.hideElement,
    showBlock = this.showElement;

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
