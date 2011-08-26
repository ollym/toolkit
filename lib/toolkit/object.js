Object.parent = Object.getPrototypeOf;
Object.values = function(obj, start, length) {
	return Array.prototype.slice.call(obj, start, length);
}

/**
 * Returns whether or not the value is an object.
 * 
 * @param value The value to check if it is an object
 * @return bool
 */
Object.isObject = function(value) {
	return typeof value === 'object';
}

/**
 * Determines whether a given parent is within the object's prototypal chain
 *
 * @param object The object you want to check
 * @param parent The parental object you want to find in the prototypal chain
 * @return bool
 */
Object.inherits = function(object, parent) {
	return Object.chain(object).contains(parent);
}

/**
 * Returns every parent within an object's prototypal chain
 *
 * @param object The object you want to get the prototypal chain for
 * @return array
 */
Object.chain = function(object) {
	for (var chain = []; object = Object.getPrototypeOf(object); chain.push(object));
	return chain;
}

/**
 * Provides a utility to quickly iterate through enumerable properties of an object
 *
 * @param object The object you want to iterate through
 * @param function The callback that takes parameters (key, value)
 * @return void
 */
Object.each = function(obj, callback) {
	
	for (key in obj)
		if (callback(key, obj[key]) === false)
			break;
	
	return obj;
}

/**
 * Similar to Array.map except for enumerable object properties
 *
 * @param object The object you want to map
 * @param function The callback that takes parameters (value, key) and should return a new value
 * @return object
 */
Object.map = function(object, callback) {
	var obj = {};
	Object.each(object, function(key, value) {
		obj[key] = callback(value, key);
	});
	return obj;
}

/**
 * Retrieves object property descriptors for every property within an object
 *
 * @param object The object you want to get the property descriptors for
 * @return void
 */
Object.getOwnPropertyDescriptors = function(object) {
	
	var descriptors = {};
	
	Object.getOwnPropertyNames(object).forEach(function(key) {
		descriptors[key] = Object.getOwnPropertyDescriptor(object, key);
	});
	
	return descriptors;
}

/**
 * Provides a neat utility method for extending other javascript objects
 *
 * @param function A function with prototype to extend
 * @param prototype An object of compliant ECMA5 descriptors or property values to include in the prototype
 * @return 
 */
Object.extend = function(parent, prototype) {
	
	Object.defineProperties(parent.prototype, prototype);
}

/**
 * Can recursively and non-recursively merge two enumerable objects together
 * 
 * @param objects A list of objects to merge
 * @param levels The number of recursive levels to merge to. Anything less than 1 will merge completely recursively.
 */
Object.mixin = function(objects, levels) {
	
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
}

Object.filter = function(object, callback) {
	var obj = {};
	Object.each(object, function(key, val) {
		if (callback(key, val) !== false) {
			obj[key] = val;
		}
	});
	return obj;
}

Object.clean = function(obj) {
	Object.filter(obj, function(key, val) {
		return val === undefined;
	});
}

/**
 * Finds the key-based intersection of the enumerable objects. Key's are preserved.
 *
 */
Object.intersectKey = function(object, object1, _) {
	
	var args = Object.values(arguments).reverse(), obj = {};
	
	return Object.map(args.splice(-1, 1)[0], function(val, key) {
		return args.each(function(obj) {
			if (key in obj) return obj[key];
		});
	});
}
