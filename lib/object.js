extend(Object, {
  
  follow: function follow(obj, keys, sep){
    /**
     * Follows a set of keys deep into the recursive object and returns the end value.
     *
     * @since 1.5.3
     * @param obj The object to follow.
     * @param keys Either an array of keys or a string of key names seperated by dots.
     * @param [seperator='.']  
     * @example
     *  var obj = {a:{b:{c:'d'}}};
     *  Object.follow(obj, ['a','b','c'])
     *    // returns 'd'
     *
     *  Object.follow(obj, 'a.b') === obj.a.b;
     *    // returns true
     *
     *  Object.follow(obj, 'a/b', '/') === obj.a.b;
     *    // returns true
     *
     * @returns mixed
     */
    if ( ! Array.isArray(keys)) {
      if (typeof keys !== 'string')
        throw new TypeError('Object.follow requires keys to either be an array or string value.');
      
      keys = keys.split(sep || '.');
    }
    
    return keys.reduce(function (o,k) {
      if (o && (k in o))
        return o[k];
    }, obj);
  },
  
  value: function value(obj, key /*, value*/) {
    
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
     *  var obj = Object.create(null, {
     *    a: { value: 'b' },
     *    b: { value: 'c', configurable: true }
     *  });
     * 
     *  Object.remove(obj, 'a') // returns false, and value isn't removed.
     *  Object.remove(obj, 'b') // returns true, and value is removed.
     *
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
     *  Object.id(a) == Object.id(a)
     *    // true
     * 
     * @returns string
     */
    if ( ! objectIdStore.contains(obj))
      objectIdStore.push(obj);

    return objectIdStore.indexOf(obj);
    
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
     *  obj[3] === obj[6]
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
        desc.get = function () {
          return object[property];
        }
      }

      desc.set = function (val) {
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
    Object.keys(obj).forEach(function (key) {
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
     *  Object.forEach({1:2,3:4}, function (key, val, obj) {
     *    log(key + ':' + val)
     *  });
     *  // > 1:2
     *  // > 3:4
     * 
     * @returns void
     */
    return Object.keys(obj).forEach(function (key) {
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
     *  Object.isObject(function () { });
     *    // returns true
     *
     *  Object.isObject(123, {});
     *    // returns false
     * 
     * @returns bool
     */
    return Array.prototype.slice.call(arguments).every(function (value) {
      return Object(value) === value;
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
     *  Object.each({1:2,3:4}, function (key, val, obj) {
     *    return (key + ':' + val);
     *  });
     *  // returns '1:2'
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
     *  Object.map({1:2,3:4}, function (key, val) {
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
     *  Object.map$(obj, function (key, val) {
     *    return key * val;
     *  }) === obj;
     *  obj;
     *  // obj = {1:2,3:12}
     * 
     * @returns self
     */
     Object.forEach(obj, function (key, val) {
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

    Object.getOwnPropertyNames(object).forEach(function (key) {
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
     *  Object.reduce({1:2,3:4}, function (group, key, val) {
     *    return group + key + val;
     *  }, '0');
     *  // returns '01234'
     * 
     * @returns mixed
     */
    Object.forEach(obj, function (key, val) {
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
    
    return objects.reduce(function (group, obj) {
      Object.forEach(obj, function (key, val) {
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

    Object.filter$(object, function (key, val) { return Object.hasOwnProperty.call(obj, key) });
    Object.map$(object, function (key, val) { return obj[key]; });

    Object.keys(obj).diff(Object.keys(object)).forEach(function (key) {
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
     *  Object.filter({1:2,3:4,5:6}, function (key, val, object) {
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
     *  Object.filter$(obj, function (key, val, object) {
     *    return key == 3;
     *  }) === obj;
     *  obj;
     *  // obj = {3:4} 
     *
     *  // Since 1.4.0:
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, [1,3]) === obj;
     *  obj;
     *  // obj = {1:2,3:4}
     * 
     * @returns self
     */
    if (Array.isArray(callback)) var keys = callback.invoke('toString');
    Object.forEach(obj, function (key, val) {
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
    return Object.filter(obj, function (key, val) {
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
     *  Object.clean$(obj) === obj;
     *  obj;
     *    // obj = {5:6} 
     * 
     * @returns object
     */
    return Object.filter$(obj, function (key, val) {
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
    
    keys.forEach(function (key, i) {
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
     *  obj.keys();
     *  obj.size();
     *  obj.values();
     *  // size(), keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
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
     *  obj.keys();
     *  obj.size();
     *  obj.values();
     *  // size(), keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.defineProperties(object, {

      size: { value: function () {
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
    return object.__proto__ || object.constructor.prototype || protoStore[Object.id(object)];
  });
  
if ( ! Object.getOwnPropertyDescriptor || domDefineProperty) {
  var oldGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, objectDescriptorStore = {};
  extend(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(object, property) {
    if (object.nodeType && oldGetOwnPropertyDescriptor) return oldGetOwnPropertyDescriptor(object, property);
    if ( ! Object.isObject(object)) throw new TypeError(object + ' is not an object.');
    if ( ! Object.prototype.hasOwnProperty.call(object, property)) return;
    
    var descriptor = { enumerable: Object.prototype.propertyIsEnumerable.call(object, property),
      writable: true, configurable: true }, getter, setter, id = Object.id(object);
    
    if ((object instanceof Function && ['arguments','length','name','prototype','caller'].contains(property)) ||
        (object === Number && ['NaN','NEGATIVE_INFINITY','POSITIVE_INFINITY','MAX_VALUE','MIN_VALUE'].contains(property)) ||
        (object === Math && ['LN10','PI','E','LOG10E','SQRT2','LOG2E','SQRT1_2','LN2'].contains(property)))
      descriptor = {configurable:false, writable:false, enumerable:false};
      
    if (object instanceof RegExp && ['lastIndex','multiline','global','source','ignoreCase'].contains(property))
      descriptor = {configurable:false, writable:(property == 'lastIndex'), enumerable:false};
    
    if ((Array.isArray(object) || String.isString(object)) && property === 'length')
      descriptor = { configurable:false, writable:true, enumerable:false }
      
    else if (objectDescriptorStore[id] && (property in objectDescriptorStore[id]))
      descriptor = objectDescriptorStore[id][property];
    
    if (Object.prototype.__lookupGetter__ && (getter = object.__lookupGetter__(property))) {
      descriptor.writable = false;
      descriptor.get = getter;
    }
    if (Object.prototype.__lookupSetter__ && (setter = object.__lookupSetter__(property))) {
      descriptor.writable = false;
      descriptor.set = setter;
    }
    
    if ( ! ('set' in descriptor || 'get' in descriptor))
      descriptor.value = object[property];
        
    return descriptor;
  });
}

if ( ! Object.getOwnPropertyNames) {
  extend(Object, 'getOwnPropertyNames', function getOwnPropertyNames(object) {
    
    var names = Object.keys(object);
    
    if ((typeof globals !== 'undefined' && object === globals) || (typeof window !== 'undefined' && object === window))
      names.push('Infinity','NaN','undefined','decodeURI','encodeURIComponent','isNaN','decodeURIComponent','eval','parseFloat','encodeURI','isFinite','parseInt');
    
    if (object instanceof Function)
      names.push('arguments','length','name','prototype','caller');
    
    if (object === Number)
      names.push('NaN','NEGATIVE_INFINITY','POSITIVE_INFINITY','MAX_VALUE','MIN_VALUE');
    else if (object === Math)
      names.push('LN10','PI','E','LOG10E','SQRT2','LOG2E','SQRT1_2','LN2','cos','pow','log','tan','sqrt','ceil','asin','abs','max','exp','atan2','random','round','floor','acos','atan','min','sin');
    else if (object === String)
      names.push('fromCharCode');
    else if (object === Date)
      names.push('UTC','parse');
    else if (object === RegExp)
      names.push('$*','$3','$`','$9','rightContext','multiline','$7','lastParen','$input','$+','$&','leftContext','$8','$4','$1','$\'','$_','input','lastMatch','$2','$5','$6');
    else if (object === Date.prototype)
      names.push('constructor','toUTCString','setMinutes','setUTCMonth','getMilliseconds','getTime','getMinutes','getUTCHours','toString','setUTCFullYear','setMonth','getUTCMinutes','getUTCDate','setSeconds','toLocaleDateString','getMonth','toTimeString','toLocaleTimeString','setUTCMilliseconds','setYear','getUTCFullYear','getFullYear','getTimezoneOffset','setDate','getUTCMonth','getHours','toLocaleString','toISOString','toDateString','getUTCSeconds','valueOf','setUTCMinutes','getUTCDay','setUTCDate','setUTCSeconds','getYear','getUTCMilliseconds','getDay','setFullYear','setMilliseconds','setTime','setHours','getSeconds','toGMTString','getDate','setUTCHours');
    else if (object === Object.prototype)
      names.push('toString', 'toLocaleString','hasOwnProperty','valueOf','constructor','propertyIsEnumerable','isPrototypeOf');
    else if (object === Number.prototype)
      names.push('toExponential', 'toString','toLocaleString','toPrecision','valueOf','constructor','toFixed');
    else if (object === RegExp.prototype)
      names.push('toString','constructor','exec','compile','test');
    else if (object === String.prototype)
      names.push('length','constructor','concat','localeCompare','substring','italics','charCodeAt','strike','indexOf','toLowerCase','toString','toLocaleLowerCase','replace','toUpperCase','fontsize','split','substr','sub','charAt','blink','lastIndexOf','sup','fontcolor','valueOf','link','bold','anchor','small','search','fixed','big','match','toLocaleUpperCase','slice');
    else if (object === Array.prototype)
      names.push('length','constructor','concat','sort','join','indexOf','toString','splice','shift','unshift','toLocaleString','reverse','pop','push','slice');
    else if (object === Function.prototype)
      names.push('toString','constructor','call','apply','arguments','length','name','prototype','caller')
    else {
      if (object instanceof RegExp) names.push('lastIndex','multiline','global','source','ignoreCase');
      else if (Array.isArray(object) || String.isString(object)) names.push('length');
    }
        
    return names.concat(Object.keys(objectDescriptorStore[Object.id(object)] || {})).unique();
  });
}
  
if ( ! Object.create) {
  var protoStore = [];
  extend(Object, 'create', function create(prototype, descriptors) {
    
    if (prototype !== null && Object(prototype) !== prototype)
      throw new TypeError('Object prototype may only be an Object or null');
    
    var object = {};
    
    if (prototype !== null)  {
      var type = function () {}
      type.prototype = prototype;
      object = new type();
    }
    if (descriptors !== undefined)
      Object.defineProperties(object, descriptors);
    
    if (object.__proto__ !== undefined) object.__proto__ = prototype;
    else protoStore[Object.id(object)] = prototype;
    
    return object;
  });
}
  
if ( ! Object.defineProperty || domDefineProperty) {
  var oldDefineProperty = Object.defineProperty, definePropertyError = function (object, name, descriptor) {
    if ( ! Object.isObject(descriptor)) return 'Property description must be an object: ' + descriptor;
    if ( ! Object.isObject(object)) return 'Object.defineProperty called on non-object';
    
    if ('get' in descriptor) {
      if ( ! object.__defineGetter__) return 'Getters are not supported on this javascript engine.';
      if (! Function.isFunction(descriptor.get)) return 'Getter must be a function: ' + descriptor.get;
    }
    
    if ('set' in descriptor) {
      if ( ! object.__defineSetter__) return 'Setters are not supported on this javascript engine.';
      if (! Function.isFunction(descriptor.set)) return 'Setter must be a function: ' + descriptor.get;
    }
    
    if (('get' in descriptor || 'set' in descriptor) && ('value' in descriptor || descriptor.writable))
      return 'A property cannot both have accessors and be writable or have a value: ' + object;
  }
  extend(Object, 'defineProperty', function defineProperty(object, name, descriptor) {
    if (object.nodeType && oldDefineProperty) oldDefineProperty(object, name, descriptor);
    var id = Object.id(object), error, prototype;
    if ((error = definePropertyError(object, name, descriptor))) throw new TypeError(error);
    if (object.__defineGetter__) {
      if ((name in object) && (object.__lookupGetter__(name))) {
        prototype = object.__proto__;
        object.__proto__ = Object.prototype;
        delete object[name];
      }
      if ('get' in descriptor) object.__defineGetter__(name, descriptor.get);  
      if ('set' in descriptor) object.__defineSetter__(name, descriptor.set);
    }
    if ( ! objectDescriptorStore[id])     objectDescriptorStore[id] = {};
    if ( ! descriptor.writable)     descriptor.writable = false;
    if ( ! descriptor.configurable) descriptor.configurable = false;
    if ( ! descriptor.enumerable)   descriptor.enumerable = false;
    
    if ( ! ('get' in descriptor || 'set' in descriptor))
      object[name] = descriptor.value;
    
    objectDescriptorStore[id][name] = descriptor;
        
    if (prototype) object.__proto__ = prototype;
    
    return object;
  });
}

if ( ! Object.defineProperties || domDefineProperty)
  extend(Object, 'defineProperties', function defineProperties(object, descriptors) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.defineProperties called on non-object');
    var name, error;
    for (name in descriptors)
      if (error = definePropertyError(object, name, descriptors[name]))
        throw new TypeError(error);
    
    for (name in descriptors)
      Object.defineProperty(object, name, descriptors[name]);
      
    return object;
  });
  
if ( ! Object.seal)
  var sealedStore = [];
  extend(Object, 'seal', function seal(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.seal called on non-object');
    sealedStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isSealed)
  extend(Object, 'isSealed', function isSealed(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isSealed called on non-object');
    return !! sealedStore[Object.id(object)];
  });
  
if ( ! Object.freeze)
  var frozenStore = [];
  extend(Object, 'freeze', function freeze(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.freeze called on non-object');
    frozenStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isFrozen)
  extend(Object, 'isFrozen', function isFrozen(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isFrozen called on non-object');
    return !! frozenStore[Object.id(object)];
  });
  
if ( ! Object.preventExtensions)
  var preventExtensionsStore = [];
  extend(Object, 'preventExtensions', function preventExtensions(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.preventExtensions called on non-object');
    preventExtensionsStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isExtensible)
  extend(Object, 'isExtensible', function isExtensible(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isExtensible called on non-object');
    var id = Object.id(object);
    return ! preventExtensionsStore[id] && ! sealedStore[id];
  });
  
if ( ! Object.keys)
  extend(Object, 'keys', function keys(object) {
    if (object !== Object(object)) throw new TypeError('Object.keys called on non-object');
    var keys = [], key;
    for (key in object)
      if (object.hasOwnProperty(key))
        keys.push(key);
    keys = keys.filter(function (key) {
      return Object.prototype.propertyIsEnumerable.call(object, key);
    });
    
    if (String.isString(object) && ! (0 in (new String(' ')))) {
      keys = keys.concat(Array.range(0, object.length - 1));
    }
      
    return keys.map(String);
  });
  
if (domDefineProperty) {
  var oldPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;
  Object.prototype.propertyIsEnumerable = function propertyIsEnumerable(key) {
    var desc = objectDescriptorStore[Object.id(this)];
    if (desc && desc[key]) return desc[key].enumerable === true;
    else if (oldPropertyIsEnumerable) oldPropertyIsEnumerable.call(this, key);
    else { for (var name in this) if (name == key) return true; }
    return true;
  };
}