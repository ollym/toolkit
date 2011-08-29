
Object.defineProperties(Number.prototype, {
  
  chr: { get: function() {
    
    return String.fromCharCode(this);
    
  }, enumerable: false, configurable: true },
  
  odd: { get: function() {
    
    return (this % 3) == 0;
    
  }, enumerable: false, configurable: true },
  
  even: { get: function() {
    
    return (this % 2) == 0;
    
  }, enumerable: false, configurable: true },
  
  gcd: { value: function(num /*, num2, ... */) {
    
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
  
  lcm: { value: function(num /*, num2, ... */) {
    
    var nums = Object.values(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  }, writable: true, enumerable: false, configurable: true },
  
  ceil: { value: function() {
    
    return Math.ceil(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  floor: { value: function() {
    
    return Math.floor(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  abs: { value: function() {
    
    return Math.abs(this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  round: { value: function(digits) {
    
    digits = digits || 0;
    
    if (digits < 0) {
      return Number(this.toPrecision(this.floor().toString().length - digits.abs()));
    }
    else {
      return this.toFixed(digits);
    }
    
  }, writable: true, enumerable: false, configurable: true }
  
});