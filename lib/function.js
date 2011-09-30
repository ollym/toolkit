extend(Function, {
  
  isFunction: function isFunction(func) {
    /**
     * Determines whether the provided function is really function and whether it's callable.
     *
     * @since 1.5.0
     * @param func The value to test whether it is a function
     * @example
     *  Function.isFunction(Object) // returns true
     *  Function.isFunction(Math) // returns false
     *
     * @returns bool
     */
    return (typeof func === 'function') && !! func.call;
    
  },
    
  compose: function compose(funcs) {
    /**
     * Creates a new function based on the composite of all the functions given. The list of functions can either be given as an array as the first parameter or a continuous set of functions.
     *
     * @since 1.2.0
     * @param funcs* The functions to create the composite
     * @example
     *  var a = function(val) { return val ^ 2; },
     *      b = function(val) { return val / 2; };
     *  var c = Function.compose(a, b);
     *  c(5) == a(b(5));
     *
     * @returns function
     */
    if ( ! Array.isArray(funcs)) {
      funcs = Array.prototype.slice.call(arguments);
    }
    
    funcs = funcs.reverse();
    
    return function (arg) {
      return funcs.reduce(function (a,b) {
        return b(a);
      }, arg);
    }
    
  }
});

extend(Function.prototype, {

  cache: function cache(time, ident) {
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
     *  fibonacci(35);
     *  // fibonacci(50) will take a several minutes to complete
     *
     *  fibonacci = fibonacci.cache();
     *  fibonacci(35);
     *  // fibonacci(1000) will now take roughly 13ms to complete!
     * 
     * @returns function
     */
    time = isNaN(time) ? -1 : time;
    ident = ident || function (id) {
      return (typeof id == 'object') ? Object.id(id) : id.toString();
    }
    
    var cache = {}, callback = this, timeouts = {};
    
    return function () {
      
      var args = Array.prototype.slice.call(arguments), id = '(' + args.map(ident).join(',') + ')';
      
      if ( ! (id in cache)) cache[id] = callback.apply(callback, args);
      else if (id in timeouts) {
        clearTimeout(timeouts[id]);
        delete timeouts[id];
      }

      if (time > 0) {
        timeouts[id] = setTimeout(function () {
          delete cache[id];
        }, time);
      }
            
      return cache[id];
    }
     
  },
  
  delay: function delay(callback, time, scope) {
    /**
     * Delays a function by a certain amount of time then calls the callback with the result of the function
     *
     * @since 1.2.0
     * @param time The number of milliseconds before calling the function.
     * @param scope The value of this within the callback.
     * @example
     *  Date.now.delay(function (now, then) {
     *    log(now - then); // > 50 (Or very near it!)
     *  }, 50, Date.now());
     * 
     * @returns function
     */
    return setTimeout(function (args) {
      callback.apply(scope, [this()].concat(Array.prototype.slice.call(args, 2)));
    }.bind(this, arguments), time);
    
  },
  
  once: function once(scope) {
    /**
     * Caches a function indefinately. Once the callback is called for the first time it will continue to return that same value. Make sure if the function resides within an instantiated object that you have set the scope parameter.
     *
     * @since 1.4.0
     * @param scope Unfortunately the original function will loose it's scope. Re-add it here.
     * @example
     *  var FooGetter = function() { this.foo = 'bar'; }
     *  FooGetter.prototype.getFoo = function () { return this.foo; }
     *
     *  var obj = new FooGetter();
     *  obj.getFoo = obj.getFoo.once(obj);
     *
     *  obj.getFoo(); // returns 'bar'
     *  obj.foo = 'bat';
     *  obj.getFoo(); // returns 'bar' again!
     * 
     * @returns function
     */
    var called = false, val = null;
    
    return function (args) {
      
      if ( ! called) {
        called = true;
        val = this.apply(scope, args);
      }
      
      return val;
      
    }.bind(this, Array.prototype.slice.call(arguments));
  }
});

/**
 * ECMA5 Pollyfills
 */

if ( ! Function.prototype.bind)
  extend(Function.prototype, 'bind', function bind(thisArg) {
    if ( ! Function.isFunction(this)) throw new TypeError(this + ' is not a function.');
    var args = Array.prototype.slice.call(arguments, 1), self = this, target = function () {};
    
    function bound() {
      return self.apply(this instanceof target ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)));
    }
    
    target.prototype = this.prototype;
    bound.prototype = new target();
    
    return bound;
  });
  