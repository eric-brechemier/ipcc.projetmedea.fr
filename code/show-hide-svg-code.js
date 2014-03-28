within("projetmedea.fr", function(publish, subscribe){
  var
    showButton = document.getElementById("show-svg-code"),
    hideButton = document.getElementById("hide-svg-code"),
    presenterBlock = document.getElementById("svg-code-presenter"),
    codeBlock = document.getElementById("svg-code-block");

  function showSvgCode(){
    presenterBlock.className = "hidden";
    codeBlock.className = "";
  }

  function hideSvgCode(){
    presenterBlock.className = "";
    codeBlock.className = "hidden";
  }

  showButton.onclick = showSvgCode;
  hideButton.onclick = hideSvgCode;
});
