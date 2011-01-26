Object.parent = Object.getPrototypeOf;

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
Object.each = function(object, callback) {
	Object.keys(object).forEach(function(key) {
		callback(key, object[key]);
	});
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
	
	return Object.create(parent.prototype, Object.map(prototype, function(proto, key) {
		if ( ! ('value' in proto) || ! ('get' in proto || 'set' in proto)) {
			return { value: proto };
		}
		return proto;
	}));
}

/**
 * Can recursively and non-recursively merge two enumerable objects together
 * 
 * @param objects A list of objects to merge
 * @param levels The number of recursive levels to merge to. Anything less than 1 will merge completely recursively.
 */
Object.mixin = function(objects, levels) {
	
	var object = {},
		levels = levels || 1;
	
	if ( ! Array.isArray(objects) && Object.isObject(level)) {
		objects = Array.prototype.slice.call(arguments);
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