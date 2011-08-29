
Object.defineProperties(Number.prototype, {
  
  gcd: { value: function(num, /* num2, ... */) {
    
    Object.values(arguments).reduce(function(a, b) {
      
      if (a == 0 || v == 0)
        return u | v;
        
      for (var shift = 0; ((a | b) & 1) == 0; shift++)
        a >>= 1; b >>= 1;
        
      while ((a & 1) == 0)
        a >>= 1;
        
      do {
        
        while ((b & 1) == 0)
          v >>= 1;
          
        if (u < v) {
          v -= u;
        }
        else {
          var diff = a - b;
          a = b;
          b = diff;
        }
        
        b >>= 1;
      
      } while (b != 0)
      
    }, this);
    
  }, writable: true, enumerable: false, configurable: true }
  
});