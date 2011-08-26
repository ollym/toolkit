
Object.defineProperties(Math, {
  
  /**
   * Random number between two values.
   *
   * @param start A number to start from
   * @param end A number to go to
   * 
   * @return number
   */
  random: { value: function(start, end) {
    
    return (start = start || 0) + (((end || start + 1) - start) * this());
    
  }.bind(Math.random), writable: true, enumerable: false, configurable: true }
  
});