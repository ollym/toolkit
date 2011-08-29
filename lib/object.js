Object.defineProperties(Object, {

  values: { value: function(obj) {
    
    var arr = [];
    for (key in obj) {
      arr.push(obj[key]);
    }
    
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  forEach: { value: function(obj, callback) {
    
    return Object.keys(obj).forEach(function(key) {
      return callback.call(null, key, obj[key], obj);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  forEachRight: { value: function(obj, callback) {
    
    return Object.keys(obj).reverse().forEach(function(key) {
      return callback.call(null, key, obj[key], obj);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Returns whether or not the value is an object.
   * 
   * @param value The value to check if it is an object
   * @return bool
   */
  isObject: { value: function(/* obj1, obj2, ... */) {
    
    return Object.values(arguments).every(function(value) {
      return typeof value === 'object' && Object(value) === value
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Provides a utility to quickly iterate through enumerable properties of an object
   *
   * @param object The object you want to iterate through
   * @param function The callback that takes parameters (key, value)
   * @return void
   */
  each: { value: function(obj, callback) {

  	var key, result;
  	for (key in obj)
  		if ((result = callback.call(null, key, obj[key], this)) !== undefined)
  			return result;
  	
  }, writable: true, enumerable: false, configurable: true },
  
  eachRight: { value: function(obj, callback) {
    
    var keys = Object.keys(obj), result, key;
    
    for (var i = keys.length - 1; i >= 0; i--) {
      if ((result = callback.call(null, key, obj[key], this)) !== undefined) {
  			return result;
			}
    }
  	
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Similar to Array.map except for enumerable object properties
   *
   * @param object The object you want to map
   * @param function The callback that takes parameters (value, key) and should return a new value
   * @return object
   */
  map: { value : function(object, callback) {
    
    obj = Object.clone(object);
    
    Object.each(object, function(key, val) {
      obj[key] = callback.call(null, key, val, object);
    });
    
    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Retrieves object property descriptors for every property within an object
   *
   * @param object The object you want to get the property descriptors for
   * @return void
   */
  getOwnPropertyDescriptors: { value : function(object) {
    
  	var descriptors = {};

  	Object.getOwnPropertyNames(object).forEach(function(key) {
  		descriptors[key] = Object.getOwnPropertyDescriptor(object, key);
  	});

  	return descriptors;
  	
  }, writable: true, enumerable: false, configurable: true },
  
  reduce: { value : function(obj, callback, start) {
    
  	Object.forEach(obj, function(key, val) {
  	  start = callback.call(null, start, key, obj[key]);
  	});
  	
  	return start;
  	
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Can recursively and non-recursively merge two enumerable objects together
   * 
   * @param objects A list of objects to merge
   * @param levels The number of recursive levels to merge to. Anything less than 1 will merge completely recursively.
   */
  merge: { value : function(objects, level) {
    
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
  
  clone: { value: function(obj) {
    
    return Object.create(obj);
    
  }, writable: true, enumerable: false, configurable: true },

  filter: { value : function(object, callback) {
    
  	var obj = Object.clone(object);
  	
  	Object.each(object, function(key, val) {
  		if (callback.call(null, key, val) !== false) {
  			obj[key] = val;
  		}
  	});
  	
  	return obj;
  	
  }, writable: true, enumerable: false, configurable: true },
  
  clean: { value : function(obj) {
    
  	return Object.filter(obj, function(key, val) {
  		return !! val;
  	});
  	
  }, writable: true, enumerable: false, configurable: true },
  
});