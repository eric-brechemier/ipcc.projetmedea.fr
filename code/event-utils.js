within("projetmedea.fr", function(publish, subscribe) {
  var
    map = this.map,
    forEach = this.forEach;

  // Function: joinEvents( eventNames ): function
  // Combine a list of source events into a joint event
  //
  // The name of the joint event is made of all the names of
  // the source events, separated with '+'. The value of the
  // joint event is an object with one property named after
  // each event, holding the associated event value.
  //
  // The first joint event is only published once all source events
  // have been received, and a new joint event is published each time
  // the value of one of the source events changes.
  //
  // Parameter:
  //   eventNames - array of strings, list of source event names
  //
  // Returns:
  //   function, a function to cancel all subscriptions to source events
  function joinEvents( eventNames ) {
    var
      pendingEvents = eventNames.length,
      eventSubscriptions,
      eventValues = {},
      jointEventName = eventNames.join( "+" );

    eventSubscriptions = map( eventNames, function( eventName ) {
      return subscribe( eventName, function( eventValue ) {
        if ( ! eventValues.hasOwnProperty( eventName ) ) {
          // first value
          pendingEvents--;
        } else if ( eventValues[ eventName ] === eventValue ) {
          // same value
          return;
        }
        eventValues[ eventName ] = eventValue;
        if ( pendingEvents === 0 ) {
          publish( jointEventName, eventValues );
        }
      });
    });

    return function(){
      forEach( eventSubscriptions, function( eventSubscription ) {
        // call off each subscription
        eventSubscription();
      });
    };
  }

  this.joinEvents = joinEvents;
});
