within("projetmedea.fr", function() {
  var
    or = this.or,
    alias = this.alias,

    // CC0 - https://raw.github.com/eric-brechemier/nadasurf/master/hasOwnProperty.js
    hasOwnProperty = alias( Object.prototype.hasOwnProperty );

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

  // Set or increment the value  an object property
  // by given quantity (optional, defaults to 1)
  function incrementProperty( object, property, quantity ) {
    quantity = or( quantity, 1 );
    if ( !hasOwnProperty( object, property ) ) {
      object[ property ] = quantity;
    } else {
      object[ property ] += quantity;
    }
  }

  this.hasOwnProperty = hasOwnProperty;
  this.forEachProperty = forEachProperty;
  this.incrementProperty = incrementProperty;
});
