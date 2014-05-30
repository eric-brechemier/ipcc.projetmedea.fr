within("projetmedea.fr", function(publish, subscribe, get){

  var
    or = this.or,
    getSelectedOption = this.getSelectedOption,
    getOptionText = this.getOptionText,
    adjustSelectWidth = this.adjustSelectWidth,
    groupSelection = document.getElementById('group-selection');

  function updateGroupingCategory( selectedOption ){
    publish('group-by', selectedOption.value);
    publish('visualization-title',
      selectedOption.getAttribute('data-title')
    );
  }

  function whenNewGroupIsSelected() {
    var selectedOption = getSelectedOption( groupSelection );
    adjustSelectWidth( groupSelection, getOptionText( selectedOption ) );
    updateGroupingCategory( groupSelection );
  }

  groupSelection.onchange = whenNewGroupIsSelected;
  whenNewGroupIsSelected( getSelectedOption(groupSelection) );

  subscribe("group-by", function(groupName){
    publish("categories", get(groupName));
  });

});
