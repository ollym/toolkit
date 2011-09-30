extend(Number, {
  
  random: function random(start, end) {
    /**
     * Random number between two values.
     *
     * @since 1.0.0
     * @param [start=0] A number to start from
     * @param [end=1] A number to go to
     * @example
     *  Number.random(100, 1000)
     *    // returns something like 521.61242932 (between 100 and 1000)
     *
     *  Number.random()
     *    // returns something like 0.61242932 (between 0 and 1)
     * 
     * @returns int
     */  
    return (start = start || 0) + (((end || start + 1) - start) * Math.random());
    
  }
});


extend(Number.prototype, {
  
  pow: function pow(n) {
    /**
     * Returns the number to the power of n.
     *
     * @param num The power
     * @example
     *  (2).pow(8)
     *    // returns 256
     *  
     * @returns int
     */
    return Math.pow(this, n);
  },
  
  ordinal: function ordinal(append) {
    /**
     * Returns the number's english ordinal value with the number prepended. Floating numbers will be rounded.
     * 
     * @since 1.5.3
     * @param [append=true] If 
     * @example
     *  (1).ordinal()
     *    // returns '1st'
     *
     *  (32).ordinal(false)
     *    // returns 'nd'
     *
     *  12.31.ordinal()
     *    // returns '12th'
     *
     */
    append = (arguments.length === 0) ? true : !! append;
    var ord = '';
    if (this >= 4 && this <= 20) ord = 'th';
    else {
      switch (this % 10) {
        case 1: ord = 'st'; break;
        case 2: ord = 'nd'; break;
        case 3: ord = 'rd'; break;
        default: ord = 'th'; break;
      }
    }
    return (append ? this.round() : '') + ord;
  },
  
  chr: function () {
    /**
     * Gets the current integer's representing string character.
     *
     * @since 1.1.0
     * @example
     *  (72).chr()
     *    // returns 'H'
     * 
     * @returns string
     */
    return String.fromCharCode(this);
    
  },
  
  odd: function () {
    /**
     * Determine's whether this integer is an odd number. *** Deprecated *** as of 1.6.0 this will be isOdd()
     *
     * @since 1.1.0
     * @example
     *  (12).odd() // false
     *  (13).odd() // true
     * 
     * @returns boolean
     */
    return ! this.even();
    
  },
  
  even: function () {
    /**
     * Determine's whether this integer is an even number. *** Deprecated *** as of 1.6.0 this will be isEven()
     *
     * @since 1.1.0
     * @example
     *  (12).even() // true
     *  (13).even() // false
     * 
     * @returns boolean
     */
    return (this % 2) == 0;
    
  },
  
  gcd: function gcd() {
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
    return Array.prototype.slice.call(arguments).reduce(function (a, b) {
      
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
    
  },
  
  lcm: function lcm() {
    /**
     * Calculates the lowest common multiple between a set of numbers. Uses GCD within the caluclation.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (21).lcm(6)
     *    // returns 42
     * 
     * @returns integer
     */
    var nums = Array.prototype.slice.call(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  },
  
  ceil: function ceil() {
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
    
  },
  
  floor: function floor() {
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
    
  },
  
  abs: function abs() {
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
    
  },
  
  round: function round(digits) {
    /**
     * Rounds the number to a given number of digits. Negative numbers are possible. This is similar to Ruby's round().
     *
     * @since 1.1.0
     * @param [digits=0] The number of digits
     * @example
     *  1.5.round()
     *    // returns 2
     *
     *  19231.32.round(-3)
     *    // returns 1900
     * 
     * @returns integer
     */
    digits = digits || 0;
    
    if (digits == 0) {
      return Math.round(this);
    }
    else if (digits < 0) {
      return Number(this.toPrecision(this.floor().toString().length - digits.abs()));
    }
    else {
      return Number(this.toFixed(digits));
    }

  },
  
  radix: function radix(base, size, character) {
    /**
     * Transforms the number to a string base. The string will be padded with 0s if necessary.
     *
     * @since 1.3.0
     * @param radix Which base to use to represent the number (2 >= r <= 36).
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (127).radix(8, 5, '0');
     *    // returns '00177'
     * 
     * @returns string
     */
    return this.toString(base).pad(-size, (character || '0'));
    
  },
  
  bin: function bin(size, character) {
    /**
     * Binary representation of the number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (13).bin();
     *    // returns '1101'
     *
     *  '0b' + (63).bin(8);
     *    // returns 0b00111111
     * 
     * @returns string
     */
    return this.radix(0x02, size, character);
    
  },
  
  oct: function oct(size, character) {
    /**
     * Octal representation of the number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (8).oct();
     *    // returns 10
     *
     *  '0' + (8).oct(4);
     *    // returns 01000
     * 
     * @returns string
     */
    return this.radix(0x08, size, character);
    
  },
  
  dec: function dec(size, character) {
    /**
     * Decimal representation of a number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (80).dec(4);
     *    // returns '0080'
     * 
     * @returns string
     */
    return this.radix(0x0A, size, character);
    
  },
  
  hexl: function hexl(size, character) {
    /**
     * Hexadecimal representation of the number with lower-case character notations.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hexl();
     *    // returns '3ff'
     *
     *  '0x' + (15).hexl(2);
     *    // returns '0x0f'
     * 
     * @returns string
     */
    return this.radix(0x10, size, character);
    
  },
  
  hex: function hex(size, character) {
    /**
     * Hexadecimal representation of the number with uppercase-case character notations.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hex();
     *    // returns '3FF'
     *
     *  '0x' + (15).hex(2);
     *    // returns '0x0F'
     * 
     * @returns string
     */
    return this.radix(0x10, size, character).toUpperCase();
    
  },
  
  abbr: function abbr(digits, binary) {
    /**
     * The shorthand abbreviation for a number. You're a programmer! Normal people aren't. Binary defaults to false. BOOO!
     *
     * @since 1.3.0
     * @param [precision=0] The number of digits to include after the decimal point.
     * @param [binary=false] Whether the devisor should be a power of 2.
     * @example
     *  (1024).abbr();
     *    // returns '1K'
     *
     *  (1024).abbr(3);
     *    // returns '1.024K'
     *
     *  (1024).abbr(3, true);
     *    // returns '1.000K'
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
      Y: binary ? Math.pow(2, 80) : 1e24
    }
    
    var keys = Object.keys(prefixes), divs = Object.values(prefixes);
    
    if (divs[0] > this) return this.toFixed(digits);
    
    for (var i = 0; i < divs.length; i++)
      if ((this / divs[i]) < 1)
        return (this / divs[i - 1]).toFixed(digits) + keys[i - 1];
                
    return (this / divs.last()).toFixed(digits) + keys.last();
    
  }
});