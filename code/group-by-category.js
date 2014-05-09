within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    groupSelection = document.getElementById('group-selection');

  function getSelectedOption(select){
    var
      options = select.childNodes,
      selectedOption = null;
    forEach(options, function(option){
      if ( option.selected ){
        selectedOption = option;
        return true;
      }
    });
    return selectedOption;
  }

  function updateGroupingCategory(){
    var selectedOption = getSelectedOption(groupSelection);
    publish('group-by', selectedOption.value);
    publish('visualization-title',
      selectedOption.getAttribute('data-title')
    );
  }

  groupSelection.onchange = updateGroupingCategory;
  updateGroupingCategory();

  subscribe("group-by", function(groupName){
    publish("categories", get(groupName));
  });

});
