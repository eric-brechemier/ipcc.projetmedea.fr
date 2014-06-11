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

  this.identity = identity;
  this.bind = bind;
  this.alias = alias;
  this.always = always;
  this.alwaysTrue = always( true );
});
