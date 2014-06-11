within("projetmedea.fr", function() {

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

  // Log warnings to the console
  function warn(){
    console.warn.apply(console,arguments);
  }

  if ( no(console) || no(console.warn) || no(console.warn.apply) ){
    this.warn = function(){};
  } else {
    this.warn = warn;
  }

  this.no = no;
  this.or = or;
});
