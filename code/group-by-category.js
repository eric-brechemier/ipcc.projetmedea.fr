within("projetmedea.fr", function(publish, subscribe, get){

  var
    getSelectedOption = this.getSelectedOption,
    groupSelection = document.getElementById('group-selection');

  function updateGroupingCategory(){
    var selectedOption = getSelectedOption(groupSelection);
    publish('group-by', selectedOption.value);
    publish('visualization-title',
      selectedOption.getAttribute('data-title')
    );
  }

  function whenNewGroupIsSelected() {
    updateGroupingCategory();
  }

  groupSelection.onchange = whenNewGroupIsSelected;
  whenNewGroupIsSelected();

  subscribe("group-by", function(groupName){
    publish("categories", get(groupName));
  });

});
