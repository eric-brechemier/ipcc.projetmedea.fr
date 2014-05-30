within("projetmedea.fr", function() {
  var
    or = this.or,
    getOptionText = this.getOptionText,
    setOptionText = this.setOptionText,
    getSelectedOption = this.getSelectedOption,

    // hidden option used to measure the size of an option
    // with a given text in the same style.
    // The option shall be alone in a select, within a label
    // hidden using CSS visibility hidden, not display none.
    HIDDEN_OPTION_ID = "hidden-filter-option";

  // measure the clientWidth of a hidden select created for this purpose
  function getSelectWidth( optionText ) {
    var hiddenOption = document.getElementById(HIDDEN_OPTION_ID);
    setOptionText(hiddenOption, optionText);
    return hiddenOption.parentNode.clientWidth;
  }

  // adjust the width of the select to match the width of selected option
  function adjustSelectWidth( select, selectedOptionText ) {
    selectedOptionText = or(
      selectedOptionText,
      getOptionText( getSelectedOption( select ) )
    );
    select.style.width = getSelectWidth( selectedOptionText ) + "px";
  }

  this.adjustSelectWidth = adjustSelectWidth;
});
