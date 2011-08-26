Object.defineProperties(Object, {
  
  parent: { value: Object.getPrototypeOf,
  writable: true, enumerable: false, configurable: true },
  
  values: { value: function(obj, start, length) {
    
    return Array.prototype.slice.call(obj, start, length);
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Returns whether or not the value is an object.
   * 
   * @param value The value to check if it is an object
   * @return bool
   */
  isObject: { value: function(value) {
    
    return Object(value) == value;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Determines whether a given parent is within the object's prototypal chain
   *
   * @param object The object you want to check
   * @param parent The parental object you want to find in the prototypal chain
   * @return bool
   */
  inherits: { value: function(object, parent) {
    
    return Object.chain(object).contains(parent);
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Returns whether or not the value is an object.
   * 
   * @param value The value to check if it is an object
   * @return bool
   */
  chain: { value: function(object) {
    
    for (var chain = []; object = Object.getPrototypeOf(object); chain.push(object));
    
  	return chain;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Provides a utility to quickly iterate through enumerable properties of an object
   *
   * @param object The object you want to iterate through
   * @param function The callback that takes parameters (key, value)
   * @return void
   */
  each: { value: function(obj, callback) {

  	for (key in obj)
  		if (callback(key, obj[key]) === false)
  			break;

  	return obj;
  	
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Similar to Array.map except for enumerable object properties
   *
   * @param object The object you want to map
   * @param function The callback that takes parameters (value, key) and should return a new value
   * @return object
   */
  map: { value : function(object, callback) {
    
  	var obj = {};
  	Object.each(object, function(key, value) {
  		obj[key] = callback(value, key);
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
  
  /**
   * Provides a neat utility method for extending other javascript objects
   *
   * @param function A function with prototype to extend
   * @param prototype An object of compliant ECMA5 descriptors or property values to include in the prototype
   * @return 
   */
  extend: { value : function(parent, prototype) {
    
    return Object.defineProperties(parent.prototype, prototype);
  	
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Can recursively and non-recursively merge two enumerable objects together
   * 
   * @param objects A list of objects to merge
   * @param levels The number of recursive levels to merge to. Anything less than 1 will merge completely recursively.
   */
  mixin: { value : function(objects, levels) {
    
    var object = {}, levels = levels || 1;

  	if ( ! Array.isArray(objects) && Object.isObject(level)) {
  		objects = Object.values(arguments);
  		levels = 1;
  	}

  	objects.forEach(function(obj) {
  		Object.each(obj, function(key, value) {
  			object[key] = ( ! key in object) || level === 1 || ( ! [value, object[key]].every(Object.isObject)) ?
  				value : Object.mixin([object[key], value], levels - 1);
  		});
  	});
  	
  	return object;
  	
  }, writable: true, enumerable: false, configurable: true },
  

  filter: { value : function(objects, levels) {
    
  	var obj = {};
  	Object.each(object, function(key, val) {
  		if (callback(key, val) !== false) {
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
  
  intersectKey: { value : function(object, object1, _) {
    
  	var args = Object.values(arguments).reverse(), obj = {};

  	return Object.map(args.splice(-1, 1)[0], function(val, key) {
  		return args.each(function(obj) {
  			if (key in obj) return obj[key];
  		});
  	});
  	
  }, writable: true, enumerable: false, configurable: true },
  
});