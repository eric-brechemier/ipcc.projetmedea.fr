within("projetmedea.fr", function(){

  // Count actual records (without header) in given list
  function count(data){
    return data.length - 1; // do not count header record
  }

  this.count = count;
});
