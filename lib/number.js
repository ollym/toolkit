
Object.defineProperties(Number.prototype, {
  
  chr: { get: function() {
    
    return String.fromCharCode(this);
    
  }, enumerable: false, configurable: true },
  
  odd: { get: function() {
    
    return ! this.even;
    
  }, enumerable: false, configurable: true },
  
  even: { get: function() {
    
    return (this % 2) == 0;
    
  }, enumerable: false, configurable: true },
  
  gcd: { value: function() {
    /**
     * Calculates the Greatest common divisor between a set of numbers. Also known as the greatest common factor. This uses Stein's binary algorithm.
     *
     * @param *int The numbers to calculate
     * @example
     *  (12).gcd(6, 9)
     *    // returns 3
     * 
     * @returns int
     */
    return Object.values(arguments).reduce(function(a, b) {
      
      if (a == 0 || b == 0)
        return a | b;
        
      for (var shift = 0; ((a | b) & 1) == 0; shift++) {
        a >>= 1; b >>= 1;
      }
        
      while ((a & 1) == 0) a >>= 1;
        
      do {
        
        while ((b & 1) == 0) b >>= 1;
          
        if (a < b) b -= a;
        else {
          var diff = a - b;
          a = b;
          b = diff;
        }
        
        b >>= 1;
      
      } while (b != 0);
      
      return a << shift;
      
    }, this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  lcm: { value: function() {
    /**
     * Calculates the lowest common multiple between a set of numbers. Uses GCD within the caluclation.
     *
     * @param *int The numbers to calculate
     * @example
     *  (21).gcd(6)
     *    // returns 42
     * 
     * @returns int
     */
    var nums = Object.values(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  }, writable: true, enumerable: false, configurable: true },
  
  ceil: { value: function() {
    /**
     * Rounds up. Same as Math.ceil().
     *
     * @example
     *  12.32.ceil()
     *    // returns 13
     * 
     * @returns int
     */
    return Math.ceil(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  floor: { value: function() {
    /**
     * Rounds down. Same as Math.floor().
     *
     * @example
     *  12.32.ceil()
     *    // returns 12
     * 
     * @returns int
     */
    return Math.floor(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  abs: { value: function() {
    /**
     * Calculates the magnitude or absolute of a number. Same as Math.abs().
     *
     * @example
     *  (-21).abs()
     *    // returns 21
     * 
     * @returns int
     */
    return Math.abs(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  round: { value: function(digits) {
    /**
     * Rounds the number to a given number of digits. Negative numbers are possible. This is similar to Ruby's round().
     *
     * @param [digits=0] The number of digits
     * @example
     *  1.5.round()
     *    // returns 2
     *
     *  (1).round(1)
     *    // returns 1.0
     *
     *  (15).round(-1)
     *    // returns 20
     * 
     * @returns int
     */
    digits = digits || 0;
    
    if (digits < 0) {
      return Number(this.toPrecision(this.floor().toString().length - digits.abs()));
    }
    else {
      return this.toFixed(digits);
    }
    
  }, writable: true, enumerable: false, configurable: true }
  
});