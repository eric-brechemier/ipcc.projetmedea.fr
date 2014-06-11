within("projetmedea.fr", function() {

  // nada/copy.js (CC0)
  function copy( array ) {
    return [].concat( array );
  }

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

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/map.js
  /*
    Apply a function to all the elements in a list

    Parameters:
      array - array, the list of items to process
      operation - function( value, offset ), the function to apply to each item,
                  called with the value and offset of each item. The result of
                  the operation is stored at the same offset in result array.

    Returns:
      array, the list of results of the operation applied to each item
      of the given array.
  */
  function map( array, operation ) {
    var result = Array( array.length );

    forEach( array, function( item, i ) {
      result[ i ] = operation( item, i );
    });

    return result;
  }

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/reduce.js
  /*
    Compute a value by processing a list of items, one at a time

    Parameters:
      accumulator - any, the initial value of the computation
      array - array, the list of items to process
      operation - function( accumulator, value, offset ), a function called
                  on each item in turn to compute step by step an aggregate
                  value from the list. The accumulator is the previous result
                  of the operation, or the value provided to reduce() initially.
                  Both the value and offset of the current item are provided.

    Returns:
      any, the value of the accumulator after the last item has been processed,
      or the initial value of the accumulator when the list is empty.
  */
  function reduce( accumulator, array, operation ) {
    forEach( array, function( item, i ) {
      accumulator = operation( accumulator, item, i );
    });

    return accumulator;
  }

  this.copy = copy;
  this.forEach = forEach;
  this.map = map;
  this.reduce = reduce;
});
