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

  // CC0 - https://raw.github.com/eric-brechemier/nada/master/no.js
  /*
    Check whether given value is null or undefined

    Parameter:
      value - any, the value to check

    Returns:
      boolean, false when the value is null or undefined,
      true otherwise
  */
  function no( value ) {
    var undef; // do not trust global undefined, which can be set to a value
    return value === null || value === undef;
  }

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/or.js
  /*
    Get a default value when given value is null or undefined

    Parameters:
      a - any, the value to check
      b - any, the default value

    Returns:
      any, the default value when the value is null or undefined,
      the value itself otherwise.

    Dependency:
      nada/no.js
  */
  function or( a, b ) {
    return no( a )? b: a;
  }

  this.forEach = forEach;
  this.no = no;
  this.or = or;
});
