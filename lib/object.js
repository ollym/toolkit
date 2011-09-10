Object.defineProperties(Object, {
  
  alias: { value: function alias(object, property, alias) {
    /**
     * Creates an alias of a property within an object
     *
     * @since 1.2.0
     * @param object The object where the property lurks.
     * @param property The name of the original property
     * @param alias A new alias to assign to that object
     * @example
     *  var obj = {1:2,3:4};
     *  Object.alias(obj, 3, 6);
     *  
     *  log(obj[3] == obj[6]) // > true
     *  
     *  obj[3] = 5;
     *
     *  log(obj[3] == obj[6]) // > true
     * 
     * @returns void
     */
    var desc = Object.getOwnPropertyDescriptor(object, property);
    
    if (('get' in desc ) || ('value' in desc)) {
      delete desc['value'], delete desc['writable'];
      desc.get = function() {
        return object[property];
      }
    }
    
    desc.set = function(val) {
      return object[property] = val;
    }
    
    Object.defineProperty(object, alias, desc);

  }, writable: true, enumerable: false, configurable: true },

  values: { value: function values(obj) {
    /**
     * Gets all the enumerable values within an object.
     *
     * @since 1.0.0
     * @param object
     * @example
     *  Object.values({1:2,3:4});
     *    // returns [2,4] 
     * 
     * @returns array
     */
    var arr = [];
    for (key in obj) {
      arr.push(obj[key]);
    }
    
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  forEach: { value: function forEach(obj, callback, scope) {
    /**
     * A fast looping mechanism for objects. Like Array.forEach.
     *
     * @since 1.0.0
     * @param object
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  Object.forEach({1:2,3:4}, function(key, val, obj) {
     *    log(key + ':' + val)
     *  });
     *  // > 1:2
     *  // > 3:4
     * 
     * @returns void
     */
    return Object.keys(obj).forEach(function(key) {
      return callback.call(null, key, obj[key], obj);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  isObject: { value: function isObject() {
    /**
     * Returns whether all the given parameters are objects
     *
     * @since 1.0.0
     * @param *objects
     * @example
     *  Object.isObject({1:2,3:4});
     *    // returns true
     *  
     *  Object.isObject(function() { });
     *    // returns false
     *
     *  Object.isObject({1:2,3:4}, function() { });
     *    // returns false
     * 
     * @returns bool
     */
    return Object.values(arguments).every(function(value) {
      return typeof value === 'object' && Object(value) === value;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  each: { value: function each(obj, callback, scope) {
    /**
     * Provides a utility to quickly iterate through enumerable properties of an object.
     *
     * @since 1.0.0
     * @param object The object you want to iterate through
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  var ret = Object.each({1:2,3:4}, function(key, val, obj) {
     *    return (key + ':' + val);
     *  });
     *  // ret = 1:2
     * 
     * @returns mixed
     */
    var key, result;
    for (key in obj)
      if ((result = callback.call(null, key, obj[key], this)) !== undefined)
        return result;
    
  }, writable: true, enumerable: false, configurable: true },
  
  map: { value : function map(object, callback, scope) {
    /**
     * Similar to Array.map except for enumerable object properties.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  Object.map({1:2,3:4}, function(key, val) {
     *    return key * val;
     *  });
     *  // returns {1:2,3:12}
     * 
     * @returns object
     */
    var obj = Object.clone(object);

    Object.map$(obj, callback, scope);

    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  map$: { value : function map$(obj, callback, scope) {
    /**
     * A self-modification version of Object.map.
     *
     * @since 1.3.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4};
     *  Object.map(obj, function(key, val) {
     *    return key * val;
     *  });
     *  // obj = {1:2,3:12}
     * 
     * @returns self
     */
     Object.forEach(obj, function(key, val) {
       obj[key] = callback.call(scope, key, val);
     });
     
     return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  getOwnPropertyDescriptors: { value : function getOwnPropertyDescriptors(object) {
    /**
     * Retrieves object property descriptors for every property within an object
     *
     * @since 1.0.0
     * @param object The object you want to get the property descriptors for
     * @example
     *  Object.getOwnPropertyDescriptors({1:2,3:4});
     *  // returns { 
     *  //  '1': {
     *  //     value: 2,
     *  //     writable: true,
     *  //     enumerable: true,
     *  //     configurable: true
     *  //   },
     *  //   '3': {
     *  //     value: 4,
     *  //     writable: true,
     *  //     enumerable: true,
     *  //     configurable: true
     *  //   }
     *  // } 
     * @returns array
     */
    var descriptors = {};

    Object.getOwnPropertyNames(object).forEach(function(key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(object, key);
    });

    return descriptors;
    
  }, writable: true, enumerable: false, configurable: true },
  
  walk: { value: function walk(obj, callback) {
    /**
     * Similar to Object.map except that the callback values are applied to the object instance and not a clone. 
     *
     * @since 1.1.0
     * @depricated 1.3.0
     * @param object The object you want to walk
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @example
     *  var obj = {1:2,3:4};
     *  Object.map(obj, function(key, val) {
     *    return key * val;
     *  });
     *  // obj = {1:2,3:12}
     * 
     * @returns self
     */
    Object.forEach(obj, function(key, val) {
      obj[key] = callback.call(null, key, val);
    });
    
    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  reduce: { value : function reduce(obj, callback, start) {
    /**
     * Like Array.reduce except for objects. Reduces the object down into a single value.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param callback The function to call on each iteration
     * @param [start=undefined] The initial value
     * @example
     *  Object.reduce({1:2,3:4}, function(group, key, val) {
     *    return group + key + val;
     *  }, 0);
     *  // returns 10 (0+1+2+3+4)
     * 
     * @returns mixed
     */
    Object.forEach(obj, function(key, val) {
      start = callback.call(null, start, key, obj[key]);
    });
    
    return start;
    
  }, writable: true, enumerable: false, configurable: true },
  
  merge: { value : function merge(objects, level) {
    /**
     * Like Array.reduce except for objects. Reduces the object down into a single value. You can pass the first parameter as an array or treat it as *objects and ignore the level.
     *
     * @since 1.0.0
     * @param object The array of objects you wish to merge
     * @param [level=0] How many levels down to merge
     * @example
     *  Object.merge({1:2}, {3:4}, {5:6});
     *    // returns {1:2,3:4,5:6}
     *  
     *  Object.merge([{1:2}, {3:4}, {5:6}]);
     *    // returns {1:2,3:4,5:6}
     *
     *  Object.merge({1:2,3:{4:5}}, {1:3,3:{5:6}});
     *    // returns {1:3,3:{5:6}}
     *
     *  // The second parameter with the first being an array of objects is how many levels deep to merge (recursive merge). This defaults to 0. -1 will recursively merge indefinitely.
     *  Object.merge([{1:2,3:{4:5}}, {1:3,3:{5:6}}], 1);
     *    // returns {1:3,3:{4:5,5:6}}
     * 
     * @returns object
     */
    if (Object.isObject(objects, level)) {
      objects = Object.values(arguments), level = 0;
    }
    
    level = (level === undefined) ? 0 : level;
    
    return objects.reduce(function(group, obj) {
      Object.forEach(obj, function(key, val) {
        if ( ! val in group || level == 0 || ! Object.isObject(group[key]) || ! Object.isObject(val)) {
          group[key] = val;
        }
        else {
          group[key] = Object.merge([group[key], val], level - 1);
        }
      });
      
      return group;
      
    }, {});
    
  }, writable: true, enumerable: false, configurable: true },
  
  clone: { value: function clone(obj, inherit) {
    /**
     * Clones an object by creating a new object with the same parent prototype and then manually adding all the property descriptors.
     *
     * @since 1.0.0
     * @param object The object you want to clone
     * @param [inherit=true] Whether to merge in the values of the parent.
     * @example
     *  function A() { }
     *  Object.defineProperty(A.prototype, 'foo', { value: 'bar' });
     *  var a = new A(), b = Object.clone(a);
     *   
     *  a.foo == b.foo
     *    // returns true 
     *   
     *  a == b
     *    // returns false
     * 
     * @returns object
     */
    inherit = (inherit === undefined) ? true : false;
    
    return Object.create(Object.getPrototypeOf(obj), inherit ? Object.getOwnPropertyDescriptors(obj) : undefined);
    
  }, writable: true, enumerable: false, configurable: true },

  filter: { value : function filter(object, callback, scope) {
    /**
     * Like Array.filter except for objects. Only enumerable values are filtered.
     *
     * @since 1.0.0
     * @param object The object you want to filter
     * @param callback The callback to call on each property
     * @example
     *  Object.filter({1:2,3:4,5:6}, function(key, val, object) {
     *    return key == 3;
     *  });
     *  // returns {3:4} 
     * 
     * @returns object
     */
    var obj = Object.clone(object);
    
    return Object.filter$(obj, callback, scope);
    
  }, writable: true, enumerable: false, configurable: true },
  
  filter$: { value : function filter$(obj, callback, scope) {
    /**
     * Self-modification version of Object.filter.
     *
     * @since 1.3.0
     * @param object The object you want to filter
     * @param callback The callback to call on each property
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter(obj, function(key, val, object) {
     *    return key == 3;
     *  });
     *  // obj = {3:4} 
     * 
     * @returns self
     */
    Object.forEach(obj, function(key, val) {
      if (callback.call(scope, key, val, obj) === false)
        delete obj[key];
    });
    
    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  clean: { value : function clean(obj) {
    /**
     * Like Array.clean except for objects. The following values are filtered: NaN, undefined, null, 0 or false
     *
     * @since 1.0.0
     * @param object The object you want to clean
     * @example
     *  Object.clean({1:false,2:0,3:NaN,4:null,5:6});
     *    // returns {5:6} 
     * 
     * @returns object
     */
    return Object.filter(obj, function(key, val) {
      return !! val;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  clean$: { value : function clean$(obj) {
    /**
     * A self-modification version of Object.clean.
     *
     * @since 1.3.0
     * @param object The object you want to clean
     * @example
     *  var obj = {1:false,2:0,3:NaN,4:null,5:6};
     *  Object.clean(obj);
     *    // obj = {5:6} 
     * 
     * @returns object
     */
    return Object.filter$(obj, function(key, val) {
      return !! val;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  size: { value : function size(obj) {
    /**
     * Calculates the number of enumerable properties within the object
     *
     * @since 1.3.0
     * @param object The object you want to count
     * @example
     *  var obj = {1:2,3:4,5:6,7:8};
     *  Object.size(obj);
     *    // returns 4
     * 
     * @returns integer
     */
    return Object.keys(obj).length;
    
  }, writable: true, enumerable: false, configurable: true }
  
});

Object.defineProperties(Object.prototype, {
  
  __objectHashVal__: { value: null },
  __objectHash__: { get: function() {
    /**
     * Returns a unique ID with respect to that current object.
     *
     * @since 1.2.0
     * @example
     *  function A() {}
     *  A.prototype = { foo: 'bar' };
     *
     *  (new A()).__objectHash__
     * 
     * @returns string
     */
    return this.__objectHashVal__ || (this.__objectHashVal__ = String.UUID());
    
  }, enumerable: false }
});