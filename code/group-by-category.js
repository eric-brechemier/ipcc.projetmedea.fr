within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    groupingForm = document.getElementById('data-grouping'),
    groupingOptions = groupingForm['group-by'];

  function getSelectedValue(inputs){
    var selectedValue = null;
    forEach(inputs, function(input){
      if ( input.checked ){
        selectedValue = input.value;
        return true;
      }
    });
    return selectedValue;
  }

  function updateGroupingCategory(){
    publish('group-by', getSelectedValue(groupingOptions) );
  }

  forEach(groupingOptions, function(input){
    input.onchange = updateGroupingCategory;
  });
  updateGroupingCategory();

  subscribe("group-by", function(groupName){
    publish("categories", get(groupName));
  });

});
