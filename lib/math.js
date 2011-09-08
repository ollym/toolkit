var rand = Math.random;

Object.defineProperties(Math, {
  
  random: { value: function(start, end) {
    /**
     * Random number between two values.
     *
     * @since 1.0.0
     * @param [start=0] A number to start from
     * @param [end=1] A number to go to
     * @example
     *  Math.random(100, 1000)
     *    // returns something like 521.61242932 (between 100 and 1000)
     *
     *  Math.random()
     *    // returns something like 0.61242932 (between 0 and 1)
     * 
     * @returns int
     */  
    return (start = start || 0) + (((end || start + 1) - start) * rand());
    
  }, writable: true, enumerable: false, configurable: true }
  
});