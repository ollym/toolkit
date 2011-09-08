Object.defineProperties(Function, {
  
  compose: { value: function(funcs) {
    /**
     * Creates a new function based on the composite of all the functions given. The list of functions can either be given as an array as the first parameter or a continuous set of functions.
     *
     * @since 1.2.0
     * @param funcs* The functions to create the composite
     * @example
     *  function A(a) { return a ^ 2 }
     *  function B(a) { return a / 2 }
     *  var C = Function.compose(A, B);
     *  C(5) // Same as A(B(5))
     *
     * @returns function
     */
    if ( ! Array.isArray(funcs)) {
      funcs = Array.prototype.slice.call(arguments);
    }
    
    funcs = funcs.reverse();
    
    return function(arg) {
      return funcs.reduce(function(a,b) {
        return b(a);
      }, arg);
    }
    
  }, writable: true, enumerable: false, configurable: true }
  
});

Object.defineProperties(Function.prototype, {

  cache: { value: function(time, ident) {
    /**
     * Caches the result of the function for specified period of time. The ident parameter allows you to specify your own hashing function for the parameters.
     *
     * @since 1.2.0
     * @param time The number of milliseconds before deleting the cache.
     * @param ident A callback used to map arguments to ids.
     * @example
     *  var fibonacci = function(n) {
     *    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     *  };
     *  // fibonacci(50) will take a several minutes to complete
     *
     *  var fibonacci = fibonacci.cache();
     *  // fibonacci(1000) will now take roughly 13ms to complete!
     * 
     * @returns function
     */
    time = isNaN(time) ? -1 : time;
    ident = ident || function(id) {
      return (typeof id == 'object') ? id.__objectHash__ : id.toString();
    }
    
    var cache = {}, callback = this, timeouts = {};
    
    return function() {
      
      var args = Object.values(arguments), id = '(' + args.map(ident).join(',') + ')';
      
      if ( ! (id in cache)) cache[id] = callback.apply(callback, args);
      else if (id in timeouts) {
        clearTimeout(timeouts[id]);
        delete timeouts[id];
      }

      if (time > 0) {
        timeouts[id] = setTimeout(function() {
          delete cache[id];
        }, time);
      }
            
      return cache[id];
    }
     
  }, writable: true, enumerable: false, configurable: true },
  
  delay: { value: function(callback, time) {
    /**
     * Delays a function by a certain amount of time then calls the callback with the result of the function
     *
     * @since 1.2.0
     * @param time The number of milliseconds before calling the function.
     * @example
     *  Date.now.delay(function(now, then) {
     *    log(now - then); // > 50 (Or very near it!)
     *  }, 50, Date.now());
     * 
     * @returns function
     */
    return setTimeout(function(args) {
      callback.apply(callback, [this()].concat(Array.prototype.slice.call(args, 2)));
    }.bind(this, arguments), time);
    
  }, writable: true, enumerable: false, configurable: true }
  
});