within("projetmedea.fr", function(publish, subscribe, get){

  var
    forEach = this.forEach,
    groupingForm = document.getElementById('data-grouping'),
    groupingOptions = groupingForm['group-by'];

  function getCheckedInput(inputs){
    var checkedInput = null;
    forEach(inputs, function(input){
      if ( input.checked ){
        checkedInput = input;
        return true;
      }
    });
    return checkedInput;
  }

  function updateGroupingCategory(){
    var selectedOption = getCheckedInput(groupingOptions);
    publish('group-by', selectedOption.value);
    publish('visualization-title', selectedOption.getAttribute('data-title') );
  }

  forEach(groupingOptions, function(input){
    input.onchange = updateGroupingCategory;
  });
  updateGroupingCategory();

  subscribe("group-by", function(groupName){
    publish("categories", get(groupName));
  });

});
