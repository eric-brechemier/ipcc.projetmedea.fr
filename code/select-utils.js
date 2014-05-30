within("projetmedea.fr", function() {
  var
    setOptionText = this.setOptionText,

    NBSP = this.NBSP,

    // hidden option used to measure the size of an option
    // with a given text in the same style.
    // The option shall be alone in a select, within a label
    // hidden using CSS visibility hidden, not display none.
    HIDDEN_OPTION_ID = "hidden-filter-option";

  // measure the clientWidth of a hidden select created for this purpose
  function getSelectWidth( optionText ) {
    var hiddenOption = document.getElementById(HIDDEN_OPTION_ID);
    // add an extra NBSP after the text to measure
    // to leave one space of padding before the arrow
    setOptionText(hiddenOption, optionText + NBSP);
    return hiddenOption.parentNode.clientWidth;
  }

  // adjust the width of the select to match the width of selected option
  function adjustSelectWidth( select, selectedOptionText ) {
    select.style.width = getSelectWidth( selectedOptionText ) + "px";
  }

  this.adjustSelectWidth = adjustSelectWidth;
});
