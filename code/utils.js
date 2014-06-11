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
  this.no = no;
  this.or = or;
  this.bind = bind;
  this.alias = alias;
  this.alwaysTrue = always( true );
});
