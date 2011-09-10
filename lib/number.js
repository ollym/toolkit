
Object.defineProperties(Number.prototype, {
  
  chr: { get: function() {
    /**
     * Gets the current integer's representing string character.
     *
     * @since 1.1.0
     * @example
     *  (72).chr
     *    // returns 'H'
     * 
     * @returns string
     */
    return String.fromCharCode(this);
    
  }, enumerable: false, configurable: true },
  
  odd: { get: function() {
    /**
     * Determine's whether this integer is an odd number.
     *
     * @since 1.1.0
     * @example
     *  (12).odd // false
     *  (13).odd // true
     * 
     * @returns boolean
     */
    return ! this.even;
    
  }, enumerable: false, configurable: true },
  
  even: { get: function() {
    /**
     * Determine's whether this integer is an even number.
     *
     * @since 1.1.0
     * @example
     *  (12).odd // true
     *  (13).odd // false
     * 
     * @returns boolean
     */
    return (this % 2) == 0;
    
  }, enumerable: false, configurable: true },
  
  gcd: { value: function gcd() {
    /**
     * Calculates the Greatest common divisor between a set of numbers. Also known as the greatest common factor. This uses Stein's binary algorithm.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (12).gcd(6, 9)
     *    // returns 3
     * 
     * @returns integer
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
  
  lcm: { value: function lcm() {
    /**
     * Calculates the lowest common multiple between a set of numbers. Uses GCD within the caluclation.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (21).gcd(6)
     *    // returns 42
     * 
     * @returns integer
     */
    var nums = Object.values(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  }, writable: true, enumerable: false, configurable: true },
  
  ceil: { value: function ceil() {
    /**
     * Rounds up. Same as Math.ceil().
     *
     * @since 1.1.0
     * @example
     *  12.32.ceil()
     *    // returns 13
     * 
     * @returns integer
     */
    return Math.ceil(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  floor: { value: function floor() {
    /**
     * Rounds down. Same as Math.floor().
     *
     * @since 1.1.0
     * @example
     *  12.32.floor()
     *    // returns 12
     * 
     * @returns integer
     */
    return Math.floor(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  abs: { value: function abs() {
    /**
     * Calculates the magnitude or absolute of a number. Same as Math.abs().
     *
     * @since 1.1.0
     * @example
     *  (-21).abs()
     *    // returns 21
     * 
     * @returns integer
     */
    return Math.abs(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  round: { value: function round(digits) {
    /**
     * Rounds the number to a given number of digits. Negative numbers are possible. This is similar to Ruby's round().
     *
     * @since 1.1.0
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
     * @returns integer
     */
    digits = digits || 0;
    
    if (digits < 0) {
      return Number(this.toPrecision(this.floor().toString().length - digits.abs()));
    }
    else {
      return this.toFixed(digits);
    }
    
  }, writable: true, enumerable: false, configurable: true },
  
  radix: { value: function radix(base, size, char) {
    /**
     * Transforms the number to a string base. The string will be padded with 0s if necessary.
     *
     * @since 1.3.0
     * @param radix Which base to use to represent the number (2 >= r <= 36).
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (127).radix(8, 5, '0');
     *    // returns '087'
     * 
     * @returns string
     */
    return this.toString(base).pad(-size, (char || '0'));
    
  }, writable: true, enumerable: false, configurable: true },
  
  bin: { value: function bin(size, char) {
    /**
     * Binary representation of the number.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (15).bin(8);
     *    returns '00001111'
     * 
     * @returns string
     */
    return this.radix(0x02, size, char);
    
  }, writable: true, enumerable: false, configurable: true },
  
  oct: { value: function oct(size, char) {
    /**
     * Octal representation of the number.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (127).oct(4);
     *    returns '0177'
     * 
     * @returns string
     */
    return this.radix(0x08, size, char);
    
  }, writable: true, enumerable: false, configurable: true },
  
  dec: { value: function dec(size, char) {
    /**
     * Decimal representation of a number.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (80).dec(4);
     *    returns '0080'
     * 
     * @returns string
     */
    return this.radix(0x0A, size, char);
    
  }, writable: true, enumerable: false, configurable: true },
  
  hexl: { value: function hexl(size, char) {
    /**
     * Hexadecimal representation of the number with lower-case character notations.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hexl();
      *    returns '3ff'
     * 
     * @returns string
     */
    return this.radix(0x10, size, char);
    
  }, writable: true, enumerable: false, configurable: true },
  
  hex: { value: function hex(size, char) {
    /**
     * Hexadecimal representation of the number with uppercase-case character notations.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hexl();
     *    returns '3FF'
     * 
     * @returns string
     */
    return this.radix(0x10, size, char).toUpperCase();
    
  }, writable: true, enumerable: false, configurable: true },
  
  abbr: { value: function abbr(digits, binary) {
    /**
     * The shorthand abbreviation for a number.
     *
     * @since 1.3.0
     * @param size Size of string.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1024).abbr();
     *    returns '1.024K'
     *
     *  (1024).abbr();
     *    returns '1.024K'
     *
     *  (1024).abbr(3, true);
     *    returns '1K'
     * 
     * @returns string
     */
    binary = !! (binary == undefined ? false : binary);
    
    var prefixes = {
      k: binary ? 1 << 10 : 1e03,
      M: binary ? 1 << 20 : 1e06,
      G: binary ? 1 << 30 : 1e09,
      T: binary ? Math.pow(2, 40) : 1e12,
      P: binary ? Math.pow(2, 50) : 1e15,
      E: binary ? Math.pow(2, 60) : 1e18,
      Z: binary ? Math.pow(2, 70) : 1e21,
      Y: binary ? Math.pow(2, 80) : 1e24,
    }
    
    var keys = Object.keys(prefixes), divs = Object.values(prefixes);
    
    if (divs[0] > this) return this.toFixed(digits).toString();
    
    for (var i = 0; i < divs.length; i++)
      if ((this / divs[i]) < 1)
        return (this / divs[i - 1]).toFixed(digits) + keys[i - 1];
        
    return (this / divs.last()).toFixed(digits) + keys.last();
    
  }, writable: true, enumerable: false, configurable: true }

});