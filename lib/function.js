
Object.defineProperties(Function.prototype, {

  cache: { value: function(time, ident) {
    /**
     * Caches the result of the function for specified period of time. The ident parameter allows you to specify your own hashing function for the parameters.
     *
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
      
      if ( ! (id in cache)) cache[id] = callback.apply(this, args);
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
     * @param time The number of milliseconds before calling the function.
     * @example
     *  Date.now.delay(function(now, then) {
     *    log(Date.now() - now); // > 50
     *  }, 50, Date.now());
     * 
     * @returns setTimeoutId
     */
    return setTimeout(function(args) {
      callback.call(null, this(), Array.prototype.slice.call(args, 2));
    }.bind(this, arguments), time);
    
  }, writable: true, enumerable: false, configurable: true }
});