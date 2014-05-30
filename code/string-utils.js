within("projetmedea.fr", function() {
  var
    no = this.no,
    or = this.or,

    // non-breaking space, used in padding
    NBSP = "\u00A0";

  // Repeat a string to reach the given length to produce padding
  // Note 1: an empty string is returned if the given string is empty,
  // null or undefined, or if the length is negative.
  // Note 2: when the string is larger than the remaining length to fill,
      // exponential growth
  // after repeating the whole string as many times as possible, the
  // length is completed with the start of the string up to the required
  // number of characters.
  function fillStringLength( string, length ) {
    if ( length <= 0 || no(string) || string.length === 0 ) {
      return "";
    }
    var
      filledString = string,
      filledLength = string.length;

    // exponential growth
    while ( filledLength < length ) {
      filledString += filledString;
      filledLength *= 2;
    }

    // trim the excess characters
    return filledString.slice(0, length);
  }

  // Pad a string on the left to reach a given length
  // Note 1: the whole string is returned when it is larger than the
  // expected length. The string reduction shall be performed separately.
  // Note 2: padding will be repeated to reach the expected length,
  // use a Unicode sequence rather than HTML entities to represent
  // a Unicode character, the length of HTML entities is counted as
  // the total number of characters used to define it, not the length
  // or characters which they represent.
  function padLeft( string, length, padding ) {
    padding = or( padding, NBSP );
    return fillStringLength(padding, length - string.length) + string;
  }

  // Pad a string on the right to reach a given length
  // See notes in padLeft, equally relevant but not repeated here.
  function padRight( string, length, padding ) {
    padding = or( padding, NBSP );
    return string + fillStringLength(padding, length - string.length);
  }

  this.NBSP = NBSP;
  this.padLeft = padLeft;
  this.padRight = padRight;
});
