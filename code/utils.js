within("projetmedea.fr", function() {

  // CC0 - https://raw.github.com/eric-brechemier/nada/master/forEach.js
  /*
    Run given function for each item in given array,
    including items with null and undefined values

    Parameters:
      array - array, the array to iterate
      callback - function( item, offset ), the callback called at each offset,
                 with the item value and current offset provided as arguments.
                 If the callback returns true, the iteration is interrupted and
                 following items will not be processed.

    Returns:
      boolean, true when the iteration has been interrupted by a callback,
      false otherwise

    Notes:
    * items are processed in ascending order of offset, from 0 to the initial
    length of the array at the time of the call to forEach()
    * in case items are deleted, updated or inserted, the current value of each
    item at the current offset at the time of the call to the callback will be
    provided to the callback
  */
  function forEach( array, callback ) {
    var
      isBreak = false,
      i,
      length = array.length;

    for ( i = 0; i < length && !isBreak ; i++ ){
      isBreak = callback( array[ i ], i ) === true;
    }

    return isBreak;
  }

  this.forEach = forEach;
});
