within("projetmedea.fr", function() {

  // CC0 - https://raw.github.com/eric-brechemier/nada/master/identity.js
  /*
    Identity Function: return the given argument

    Parameter:
      value - any value

    Returns:
      the same value provided as parameter
  */
  function identity( value ) {
    return value;
  }

  // CC0 - https://raw.github.com/eric-brechemier/nada/master/always.js
  /*
    Create a function which always returns the given value

    Parameter:
      value - any, any value

    Returns:
      function, a function which always returns the given value,
      whatever the input
  */
  function always( value ) {
    return function() {
      return value;
    };
  }

  // CC0 - https://raw.github.com/eric-brechemier/nada/master/bind.js
  /*
    Wrap a function in a closure that configures given object as context

    Parameters:
      func - function, the function to wrap
      object - object, the object to provide as 'this' for the function

    Returns:
      function, a closure that calls the given function with provided parameters,
      with the given object configured as 'this', and returns the same value.

    Note:
    This function calls the apply() method of the given function, and its
    behavior changes depending on whether the function is in strict mode.

    When the provided function is not in strict mode:

      1) a null argument for context object defaults to the global object
      2) automatic boxing of arguments is performed

      Reference:
      https://developer.mozilla.org/en-US/docs/JavaScript/Reference
        /Functions_and_function_scope/Strict_mode#.22Securing.22_JavaScript
  */
  function bind( func, object ) {
    return function() {
      return func.apply( object, arguments );
    };
  }

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/alias.js
  /*
    Define an alias for a (Native prototype) function

    The alias allows to call the function with the context object
    as first argument, followed with regular arguments of the function.

    Example:
      var has = alias( Object.prototype.hasOwnProperty );
      has( object, name ) === object.hasOwnProperty( name ); // true

    Parameter:
      func - function, a method part of the prototype of a Constructor

    Dependency:
      nada/bind.js
  */
  function alias( func ) {
    return bind( func.call, func );
  }

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/hasOwnProperty.js
  var hasOwnProperty = alias( Object.prototype.hasOwnProperty );

  // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/forEachProperty.js
  /*
    Run given function for each property of given object matching the filter,
    skipping inherited properties

    Parameters:
      object - object, the object to iterate
      callback - function( value, name ): boolean, the callback called for each
                 property owned by the object (not inherited), with property
                 value and name provided as arguments.

    Notes:
      * properties are iterated in no particular order
      * whether properties deleted or added during the iteration are iterated
        or not is unspecified
  */
  function forEachProperty( object, callback ) {
    var
      name,
      value;

    for ( name in object ) {
      if ( hasOwnProperty( object, name ) ) {
        value = object[name];
        callback( value, name );
      }
    }
  }

  // Set or increment the value of an object property
  // by given quantity (optional, defaults to 1)
  function incrementProperty( object, property, quantity ) {

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

  // Compute the percentage that the part represents in the whole
  function percentage(part, whole){
    var percents = part / whole * 100;
    if ( percents < 1 ){
      // round to .01%
      return Math.round(percents * 100) / 100;
    } else {
      return Math.round(percents);
    }
  }

  // Log warnings to the console
  function warn(){
    console.warn.apply(console,arguments);
  }

  if ( no(console) || no(console.warn) || no(console.warn.apply) ){
    this.warn = function(){};
  } else {
    this.warn = warn;
  }

  this.identity = identity;
  this.forEach = forEach;
  this.forEachProperty = forEachProperty;
  this.incrementProperty = incrementProperty;
  this.map = map;
  this.reduce = reduce;
  this.no = no;
  this.or = or;
  this.percentage = percentage;
  this.max = bind( Math.max, Math );
  this.alwaysTrue = always( true );
});
