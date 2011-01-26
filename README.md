# JS Toolkit

## Goals
The JS Toolkit has very specific goals - as to not re-invent the wheel. They go as follows:

* Designed entirely for ECMA5 applications - Node.JS/V8 specifically.
* Performance is key and is achieved through elegance and simplicity.
* Must be able to be backwards compatible if just dropped into any standard application.

## Documentation
JS Toolkit currently contains extension methods for the following objects. This will be added to. Eventually.

* Math
* Object
* Array

### Math

#### Math.random
Generates a random number between two values

	Math.random(2, 4);
	// Output: 3.2285545337945223
	
	Math.random(2, 4, true);
	// Output: 3
	
	Math.random();
	// Output: 0.16625623148865998

### Object

#### Object.isObject
Returns whether or not the value is an object.

	Object.isObject({ foo: 'bar', baz: 'bat'}); // returns true
	Object.isObject(function() { }); // returns false
	
#### Object.each
Provides a utility to quickly iterate through enumerable properties of an object

	Object.each({foo: 1, bar: 2, baz: 3}, function(key, value) {
		console.log(key + ':' + value + ',');
	});
	
	// Outputs: foo:1,bar:2,baz:3
	
#### Object.map
Similar to Array.map except for enumerable object properties

	var obj = Object.map({ 2:3, 4:5 }, function(value, key) {
		return key * value;
	});
	
	// obj = { 2:6, 4:20 }
	
#### Object.mixin
Can recursively and non-recursively merge two enumerable objects together

	var a = {
		foo: 'bar',
		baz: {
			bat: true
		}
	}
	
	var b = {
		foo: 'baz',
		baz: {
			bar: false
		}
	}
	
	console.log(Object.mixin(a, b))
	// { foo: 'baz', baz: { bar: false }}
	
	console.log(Object.mixin([a, b], 2))
	// { foo: 'baz', baz: { bar: false, bat: true }}
	
#### Object.getOwnPropertyDescriptors
Retrieves object property descriptors for every property within an object

	console.log(Object.getOwnPropertyDescriptors({ get a() { return "something" }, set a() { "do nothing" } });
	
	// { a: { enumerable: true, configurable: true, get: function, set: undefined  },
	//   b: { enumerable: true, configurable: true, get: undefined, set: function  }}
	
#### Object.extend
Provides a neat utility method for extending other javascript objects

	function A() { console.log('A()'); }
	A.prototype = { foo: function() { console.log('A.foo()'); } }
	
	function B() { console.log('B()'); A.call(this); }
	B.prototype = Object.extend(A, {
		foo: function() {
			console.log('B.foo()');
			Object.parent(this).foo();
		}
	});
	
	var obj = new B();
	obj.foo();
	
	// Will output:
	//   B()
	//   A()
	//   B.foo()
	//   A.foo()
	
> Note: Object.extend will also merge non-enumerable properties
	
#### Object.chain
Returns every parent within an object's prototypal chain

	function A() { }
	A.prototype = { foo: 'bar' };

	function B() { }
	B.prototype = Object.extend(A, {
		bar: 'bat'
	});

	function C() { }
	C.prototype = Object.extend(B, {
		bar: 'foo'
	});

	Object.chain(C); // returns [C (object), B (object), A (object)]
	
#### Object.inherits
Determines whether a given parent is within the object's prototypal chain

	function A() { }
	A.prototype = { foo: 'bar' };
	
	function B() { }
	B.prototype = Object.extend(A, {
		bar: 'bat'
	});
	
	function C() { }
	C.prototype = Object.extend(B, {
		bar: 'foo'
	});
	
	Object.inherits(A, B); // returns false
	Object.inherits(B, A); // returns true
	Object.inherits(C, A); // returns true