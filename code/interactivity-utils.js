within("projetmedea.fr", function(){
  var
    or = this.or,

    CSS_CLASS_HIDDEN = "hidden";

  function showHide(blockId, presenterBlockId, showButtonId, hideButtonId){
    presenterBlockId = or(presenterBlockId, blockId+"-presenter");
    showButtonId = or(showButtonId, "show-"+blockId);
    hideButtonId = or(hideButtonId, "hide-"+blockId);

    var
      showButton = document.getElementById(showButtonId),
      hideButton = document.getElementById(hideButtonId),
      presenterBlock = document.getElementById(presenterBlockId),
      codeBlock = document.getElementById(blockId);

    function showSvgCode(){
      presenterBlock.className = CSS_CLASS_HIDDEN;
      codeBlock.className = "";
    }

    function hideSvgCode(){
      presenterBlock.className = "";
      codeBlock.className = CSS_CLASS_HIDDEN;
    }

    showButton.onclick = showSvgCode;
    hideButton.onclick = hideSvgCode;
  }

  this.showHide = showHide;

});
