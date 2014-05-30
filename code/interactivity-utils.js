within("projetmedea.fr", function(){
  var
    or = this.or,
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

  this.showBlock = showBlock;
  this.hideBlock = hideBlock;
  this.showHide = showHide;

});
