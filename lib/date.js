extend(Date.prototype, {
  
  fuzzyDiff: function fuzzyDiff(date, suffix, prefix) {
    /**
     * Finds the difference between the current date and another date in vague terms.
     *
     * @since 1.5.3
     * @param date The date to offset with
     * @param [suffix='ago'] The suffix to the string
     * @param [prefix='about'] The prefix to the string
     * @example
     *
     *  (new Date()).fuzzyDiff(Date.now() - 5000)
     *    // returns 'about 5 seconds ago'
     *
     * @returns string
     */
    if ( ! (date instanceof Date))
      date = new Date(date);
      
    // TODO: Needs better parsing!
    
    var delta = this.getTime() - date.getTime(),
        units = {
          second: 1000,
          minute: 60000,
          hour: 3600000,
          day: 86400000,
          year: 31557600000
        };
    
    var keys = Object.keys(units), divs = Object.values(units);
    
    for (var i = 0; i < divs.length; i++) {
      if ((delta / divs[i]) < 1 || i == divs.length) {
                
        var time = (delta / divs[i - 1]), key = keys[i - 1];
        if (time > 1) key += 's'; 
        
        if (arguments.length < 3) prefix = (time.round() == time) ? 'exactly' : 'about';
        if (arguments.length < 2) suffix = 'ago';
        
        return '%s %d %s %s'.sprintf(prefix, time.round(), key, suffix);
      }
    }
  }
});


/**
 * ECMA5 Polyfills
 */

if ( ! Date.now)  {
 extend(Date, 'now', function now() {
   return (new Date()).getTime();
 });
}

extend(Date, {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  YEAR: 31557600,
  DECADE: 315576000
});

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("2011-06-15T21:40:05+06:00"))) {
  // XXX global assignment won't work in embeddings that use
  // an alternate object for the context.
  Date = (function (NativeDate) {

    // Date.length === 7
    var Date = function (Y, M, D, h, m, s, ms) {
      var length = arguments.length;
      if (this instanceof NativeDate) {
        var date = length == 1 && String(Y) === Y ? // isString(Y)
        // We explicitly pass it through parse:
        new NativeDate(Date.parse(Y)) :
        // We have to manually make calls depending on argument
        // length here
        length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
        length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
        length >= 5 ? new NativeDate(Y, M, D, h, m) :
        length >= 4 ? new NativeDate(Y, M, D, h) :
        length >= 3 ? new NativeDate(Y, M, D) :
        length >= 2 ? new NativeDate(Y, M) :
        length >= 1 ? new NativeDate(Y) :
        new NativeDate();
        // Prevent mixups with unfixed Date object
        date.constructor = Date;
        return date;
      }
      return NativeDate.apply(this, arguments);
    };

    // 15.9.1.15 Date Time String Format. This pattern does not implement
    // extended years ((15.9.1.15.1), as `Date.UTC` cannot parse them.
    var isoDateExpression = new RegExp("^" +
    "(\\d{4})" + // four-digit year capture
    "(?:-(\\d{2})" + // optional month capture
    "(?:-(\\d{2})" + // optional day capture
    "(?:" + // capture hours:minutes:seconds.milliseconds
    "T(\\d{2})" + // hours capture
    ":(\\d{2})" + // minutes capture
    "(?:" + // optional :seconds.milliseconds
    ":(\\d{2})" + // seconds capture
    "(?:\\.(\\d{3}))?" + // milliseconds capture
    ")?" +
    "(?:" + // capture UTC offset component
    "Z|" + // UTC capture
    "(?:" + // offset specifier +/-hours:minutes
    "([-+])" + // sign capture
    "(\\d{2})" + // hours offset capture
    ":(\\d{2})" + // minutes offest capture
    ")" +
    ")?)?)?)?" +
    "$");

    // Copy any custom methods a 3rd party library may have added
    for (var key in NativeDate)
    Date[key] = NativeDate[key];

    // Copy "native" methods explicitly; they may be non-enumerable
    Date.now = NativeDate.now;
    Date.UTC = NativeDate.UTC;
    Date.prototype = NativeDate.prototype;
    Date.prototype.constructor = Date;

    // Upgrade Date.parse to handle simplified ISO 8601 strings
    Date.parse = function parse(string) {
      var match = isoDateExpression.exec(string);
      if (match) {
        match.shift(); // kill match[0], the full match
        // parse months, days, hours, minutes, seconds, and milliseconds
        for (var i = 1; i < 7; i++) {
          // provide default values if necessary
          match[i] = +(match[i] || (i < 3 ? 1 : 0));
          // match[1] is the month. Months are 0-11 in JavaScript
          // `Date` objects, but 1-12 in ISO notation, so we
          // decrement.
          if (i == 1)
          match[i]--;
        }

        // parse the UTC offset component
        var minutesOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

        // compute the explicit time zone offset if specified
        var offset = 0;
        if (sign) {
          // detect invalid offsets and return early
          if (hourOffset > 23 || minuteOffset > 59)
          return NaN;

          // express the provided time zone offset in minutes. The offset is
          // negative for time zones west of UTC; positive otherwise.
          offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
        }

        // compute a new UTC date value, accounting for the optional offset
        return NativeDate.UTC.apply(this, match) + offset;
      }
      return NativeDate.parse.apply(this, arguments);
    };

    return Date;
    })(Date);
  }