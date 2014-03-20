within("projetmedea.fr", function(){

  // Count actual records (without header) in given list
  function countData(records){
    return records.length - 1; // do not count header record
  }

  this.countData = countData;
});
