extend(Object, {
  
  purify: function purify(object) {
    /**
     * Reverts all changes made by JSToolkit in order to get descriptors to work. Use this if you're giving the object to other code to deal with.
     *
     * @since 1.5.0
     * @param object The object to revert
     * @example
     *  var obj = Object.create(null, { a: { value: 'b' }, b: { value: 'c', configurable: true }});
     *  Object.purify(obj); // obj is now ready to go!
     *  
     *  Socket.io.send(obj);
     *
     * @returns self
     */
    for (var name in object) {
      if (name === '__proto__' || name === '__getOwnPropertyDescriptors__')
        delete object[name];
      else if (typeof object[name] === 'object')
        Object.purify(object[name]);
    }
        
    return object;
  },
  
  value: function set(obj, key /*, value*/) {
    
    var desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc && ! Object.getOwnPropertyDescriptor(obj, key).writable)
      return obj[key];
    
    return (arguments.length === 2) ? obj[key] : (obj[key] = arguments[2]);
  },
  
  remove: function remove(obj, key) {
    /**
     * Removes a value from the object respecting property descriptors (configurable = false then the value will not be deleted).
     *
     * @since 1.5.0
     * @param object The object to delete from
     * @param key The name of the property to delete
     * @example
     *  var obj = Object.create(null, { a: { value: 'b' }, b: { value: 'c', configurable: true }});
     * 
     *  Object.remove(obj, 'a') // returns false, and value isn't removed.
     *  Object.remove(obj, 'b') // returns true, and value is removed.
     * @returns bool
     */
     
    if ( ! Object.getOwnPropertyDescriptor(obj, key).configurable)
      return false;
    
    if (obj.__ownPropertyDescriptors__)
      delete obj.__ownPropertyDescriptors__[key];
      
    return delete obj[key];
  },
  
  id: function id(obj) {
    /**
     * Returns a unique string representing the object instance every variable can have a uuid. Note the UUID is only valid whilst withing the current VM.
     *
     * @since 1.5.0
     * @param object
     * @example
     *  var a = {}, b = {};
     *  Object.id(a);
     *    // returns something like 412
     *
     *  Object.id(a) == Object.id(b)
     *    // false
     *
     *  Object.id(a) == Object.id(b)
     *    // true
     * 
     * @returns string
     */
    id.store = id.store || [];
    
    if ( ! id.store.contains(obj))
      id.store.push(obj);

    return id.store.indexOf(obj);
    
  },
  
  alias: function alias(object, property, alias, complete) {
    /**
     * Creates an alias of a property within an object. A true alias requires getters/setters which can be slow so by default we don't bother. If you still wan't it set complete to true.
     *
     * @since 1.2.0
     * @param object The object where the property lurks.
     * @param property The name of the original property
     * @param alias A new alias to assign to that object
     * @param [complete=false] A new alias to assign to that object
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
     * @returns self
     */
    var desc = Object.getOwnPropertyDescriptor(object, property);
    
    if ( ! complete) {
      
      Object.defineProperty(object, alias, desc);
    }
    else {
    
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
    }
    
    return object;

  },

  values: function values(obj) {
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
    Object.keys(obj).forEach(function(key) {
      arr.push(obj[key]);
    });
    
    return arr;
    
  },
  
  forEach: function forEach(obj, callback, scope) {
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
      return callback.call(scope, key, obj[key], obj);
    });
    
  },
  
  isObject: function isObject() {
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
    return Array.prototype.slice.call(arguments).every(function(value) {
      return (typeof value === 'object' && Object(value) === value);
    });
    
  },
  
  each: function each(obj, callback, scope) {
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
      if (key !== '__proto__')
        if ((result = callback.call(scope, key, obj[key], this)) !== undefined)
          return result;
    
  },
  
  map: function map(object, callback, scope) {
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
    
  },
  
  map$: function map$(obj, callback, scope) {
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
       Object.value(obj, key, callback.call(scope, key, val));
     });
     
     return obj;
    
  },
  
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
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
    
  },
  
  reduce: function reduce(obj, callback, start, scope) {
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
      start = callback.call(scope, start, key, obj[key]);
    });
    
    return start;
    
  },
  
  merge: function merge(objects, level) {
    /**
     * Merges more than one enumerable object into 1. This method is by default non-recursive but this can be changed by setting level to -1.
     *
     * @since 1.0.0
     * @param object The array of objects you wish to merge
     * @param [level=0] How many levels down to merge recursively.
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
      objects = Array.prototype.slice.call(arguments), level = 0;
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
    
  },
  
  merge$: function merge$(object, objects, level) {
    /**
     * The self-modification version of Object.merge. Except all values are merged into the first parameter
     *
     * @since 1.4.0
     * @param object The object we're merging into
     * @param object|*objects The array or list of of objects you wish to merge
     * @param [level=0] How many levels down to merge recursively.
     * @example
     *  var obj = {1:2};
     *
     *  Object.merge$(obj, {3:4}, {5:6});
     *    // obj = {1:2,3:4,5:6}
     *
     *  Object.merge$(obj, [{7:8}, {9:10}]);
     *    // obj = {1:2,3:4,5:6,7:8,9:10}
     *
     *  // See Object.merge for a recursive example.
     * 
     * @returns self
     */
    if (Array.isArray(objects))
      objects = [object].concat(objects);
    else {
      objects = Array.prototype.slice.call(arguments);
      level = undefined;
    }

    var obj = Object.merge.apply(undefined, objects, level);

    Object.filter$(object, function(key, val) { return Object.hasOwnProperty.call(obj, key) });
    Object.map$(object, function(key, val) { return obj[key]; });

    Object.keys(obj).diff(Object.keys(object)).forEach(function(key) {
      Object.value(object, key, obj[key]);
    });

    return object;
    
  },
  
  clone: function clone(obj, inherit) {
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
        
    var obj = Object.create(Object.getPrototypeOf(obj), inherit ? Object.getOwnPropertyDescriptors(obj) : undefined);
      
    return obj;
    
  },

  filter: function filter(object, callback, scope) {
    /**
     * Like Array.filter except for objects. Only enumerable values are filtered.
     *
     * @since 1.0.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  Object.filter({1:2,3:4,5:6}, function(key, val, object) {
     *    return key == 3;
     *  });
     *  // returns {3:4} 
     *
     *  // Since 1.4.0:
     *  Object.filter({1:2,3:4,5:6}, [3,5]);
     *  // returns {3:4,5:6}
     * 
     * @returns object
     */
    return Object.filter$(Object.clone(object), callback, scope);
    
  },
  
  filter$: function filter$(obj, callback, scope) {
    /**
     * Self-modification version of Object.filter.
     *
     * @since 1.3.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, function(key, val, object) {
     *    return key == 3;
     *  });
     *  // obj = {3:4} 
     *
     *  // Since 1.4.0:
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, [1,3]);
     *  // obj = {1:2,3:4}
     * 
     * @returns self
     */
    if (Array.isArray(callback)) var keys = callback.invoke('toString');
    Object.forEach(obj, function(key, val) {
      if (Array.isArray(callback)) {
        if ( ! keys.contains(key))
          Object.remove(obj, key);
      }
      else if (callback.call(scope, key, val, obj) === false)
        Object.remove(obj, key);
    });
    
    return obj;
    
  },
  
  clean: function clean(obj) {
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
    
  },
  
  clean$: function clean$(obj) {
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
    
  },
  
  size: function size(obj) {
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
    
  },
  
  combine: function combine(keys, values) {
    /**
     * Combines an array of keys and an array of values (of equal lengths) to create a new enumerable object.
     *
     * @since 1.4.0
     * @param array The keys
     * @param array The values
     * @example
     *  var keys = ['Harry', 'Bill', 'Larry'], values = [32, 52, 13];
     *  Object.combine(keys, values);
     *    // returns { 'Harry': 32, 'Bill': 52, 'Larry': 13 }
     * 
     * @returns object
     */
    var obj = {};
    
    keys.forEach(function(key, i) {
      obj[key] = values[i];
    });
    
    return obj;
    
  },
  
  hash: function hash(object) {
    /**
     * Creates an enumerable wrapper around the given objcet. Useful for simple hashes and not complex classes. Added functions: length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = Object.hash({a:1,b:2,c:3,d:4});
     *  obj.length // returns 4
     *  // length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.hash$(Object.clone(object));
    
  },
  
  hash$: function hash$(object) {
    /**
     * The self modification version of Object.hash. New methods are defined to the current object rather than a clone.
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = {a:1,b:2,c:3,d:4};
     *  Object.hash$(obj);
     *  obj.length // returns 4
     *  // length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.defineProperties(object, {

      size: { value: function() {
        return Object.size(this);
      }, writable: true, enumerable: false, configurable: true },

      keys: { value: function keys(callback, scope) {
        return Object.keys(this);
      }, writable: true, enumerable: false, configurable: true },

      each: { value: function each(callback, scope) {
        return Object.each(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      forEach: { value: function forEach(callback, scope) {
        return Object.forEach(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      map: { value: function map(callback, scope) {
        return Object.map(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      map$: { value: function map$(callback, scope) {
        return Object.map$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      reduce: { value: function reduce(callback, start) {
        return Object.reduce(this, callback, start);
      }, writable: true, enumerable: false, configurable: true },

      filter: { value: function filter(callback, scope) {
        return Object.filter(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      filter$: { value: function filter$(callback, scope) {
        return Object.filter$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clean: { value: function clean(callback, scope) {
        return Object.clean(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clean$: { value: function clean$(callback, scope) {
        return Object.clean$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clone: { value: function clone(callback, scope) {
        return Object.clone(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      merge: { value: function merge() {
        return Object.merge.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
      }, writable: true, enumerable: false, configurable: true },

      merge$: { value: function merge$() {
        return Object.merge$.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
      }, writable: true, enumerable: false, configurable: true }
      
   });
  }
});

/**
 * ECMA5 Polyfills
 */

if ( ! Object.getPrototypeOf)
  extend(Object, 'getPrototypeOf', function getPrototypeOf(object) {
    return object.__proto__ || object.constructor.prototype;
  });
  
if ( ! Object.getOwnPropertyDescriptor || domDefineProperty) {
  var oldGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  extend(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(object, property) {
    var descriptor = { enumerable: true, writable: true, configurable: true }, getter, setter;
    if (object.nodeType && oldGetOwnPropertyDescriptor)
      return oldGetOwnPropertyDescriptor(object, property);
    else if (property == '__ownPropertyDescriptors__' || ! Object.getOwnPropertyNames(object).contains(property)) return undefined;
    else if (object['__ownPropertyDescriptors__'] && (property in object['__ownPropertyDescriptors__']))
      descriptor = object['__ownPropertyDescriptors__'][property];
    
    //TODO: Save the prototype!
    
    if (Object.prototype.__defineGetter__ && (getter = object.__lookupGetter__(property))) {
      descriptor.writable = false;
      descriptor.get = getter;
      if ((setter = object.__lookupSetter__(property)))
        descriptor.set = setter;
    }
    else { descriptor.value = object[property]; }
        
    return descriptor;
  });
}

if ( ! Object.getOwnPropertyNames)
  extend(Object, 'getOwnPropertyNames', function getOwnPropertyNames(object) {
    return Object.keys(object['__ownPropertyDescriptors__'] || {}).concat(Object.keys(object)).unique();
  });
  
if ( ! Object.create)
  extend(Object, 'create', function create(prototype, descriptors) {
    
    var object = {};
    
    if (prototype !== null)  {
      var type = function() {}
      type.prototype = prototype;
      object = new type();
    }
    
    object.__ownPropertyDescriptors__ = {};
    if (descriptors !== undefined)
      Object.defineProperties(object, descriptors);
    
    object.__proto__ = prototype;
    
    return object;
  });
  
if ( ! Object.defineProperty || domDefineProperty) {
  var oldDefineProperty = Object.defineProperty;
  extend(Object, 'defineProperty', function defineProperty(object, name, descriptor) {
    if (object.nodeType && oldDefineProperty) oldDefineProperty(object, name, descriptor);
    if (object.__lookupGetter__) {
      if ((name in object) && (object.__lookupGetter__(name))) {
        var prototype = object.__proto__;
        object.__proto__ = Object.prototype;
        delete object[name];
      }
      if ('get' in descriptor) object.__defineGetter__(name, descriptor.get);
      if ('set' in descriptor) object.__defineSetter__(name, descriptor.set);
    }
    else if ('get' in descriptor || 'set' in descriptor)
      throw new TypeError('Getters and Setters are not supported on this javascript engine.');
      
    if ( ! object['__ownPropertyDescriptors__'])
      object['__ownPropertyDescriptors__'] = {};
      
    if ( ! descriptor.writable)     descriptor.writable = false;
    if ( ! descriptor.configurable) descriptor.configurable = false;
    if ( ! descriptor.enumerable)   descriptor.enumerable = false;
        
    object[name] = descriptor.value;
    object['__ownPropertyDescriptors__'][name] = descriptor;
        
    if (prototype) object.__proto__ = prototype;
    
    return object;
  });
}

if ( ! Object.defineProperties || domDefineProperty)
  extend(Object, 'defineProperties', function defineProperties(object, descriptors) {
    for (name in descriptors)
      Object.defineProperty(object, name, descriptors[name]);
    return object;
  });
  
if ( ! Object.seal)
  extend(Object, 'seal', function seal(object) {
    return object; // Impossible to polyfill
  });

if ( ! Object.isSealed)
  extend(Object, 'isSealed', function isSealed(object) {
    return false;
  });
  
if ( ! Object.freeze)
  extend(Object, 'freeze', function freeze(object) {
    return object; // Impossible to polyfill
  });

if ( ! Object.isFrozen)
  extend(Object, 'isFrozen', function isFrozen(object) {
    return false;
  });
  
if ( ! Object.preventExtensions)
  extend(Object, 'preventExtensions', function preventExtensions(object) {
    return object; // Impossible to polyfill
  });

if ( ! Object.isExtensible)
  extend(Object, 'isExtensible', function isExtensible(object) {
    return true;
  });
  
if ( ! Object.keys)
  extend(Object, 'keys', function keys(object) {
    if (object !== Object(object)) throw new TypeError('Object.keys called on non-object');
    var keys = [], key;
    for (key in object)
      if (object.hasOwnProperty(key) && key != '__proto__' && key != '__ownPropertyDescriptors__')
        keys.push(key);
    return keys.filter(function(key) {
      return Object.prototype.propertyIsEnumerable.call(object, key);
    });
  });
  
if (domDefineProperty) {
  var oldPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;
  Object.prototype.propertyIsEnumerable = function propertyIsEnumerable(key) {
    var desc;
    if ((desc = this.__ownPropertyDescriptors__) && desc[key]) return desc[key].enumerable === true;
    else return oldPropertyIsEnumerable.call(this, key);
  };
}