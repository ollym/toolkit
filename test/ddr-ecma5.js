module( "ddr-ECMA5" );


/**
 * Additional utils for testing purposes
 */
var utils = {
	
	/**
	 * Compares two arrays 
	 * @param {Array} arr1
	 * @param {Array} arr2
	 * @return true if two arrays are identical (by value) and false in other case
	 */
	compareArrays: function(arr1, arr2) {
		if (arr1.length !== arr2.length) 
			return false;
		for (var i=0; i < arr1.length; ++i) {
			if( arr1[i]==null ) {
				if( arr1[i] !== arr2[i] )
					return false;
				continue;
			}
			if( arr1[i].compare && !arr1.compare(arr2[i]) ) 
				return false;
			if (arr1[i] !== arr2[i]) 
				return false;
	    }
		return true;
	},
	
	
	/**
	 * Checks wheter error happened during code execution
	 * @param {Function} fn
	 * @return true if error happened and else in other case
	 */
	assertError: function(fn) {
		if( typeof fn !== 'function' )
			return false;
		try {
			fn();
			return false;
		} catch(e) {
			return true;
		}
	},
	
	
	/**
	 * A reference to global object
	 */
	global: (function(){ return this; })(),
	

	/**
	 * Basic test for all array methods
	 * @param {string} mth - method name
	 */
	arrayMethodTest: function(mth) {
			
		ok( Array.prototype[mth], "method existence veryfication" );
		ok ( typeof Array.prototype[mth] === 'function', mth+" should be a function" );
		
		var arr = new Array(5);
		arr[1] = 2; arr[4] = 5;
		var len = 0;
		
		if( mth !== "some" ) { // ugly exception for 'some' method, which exits after finding first matching element
			arr[mth]( function(){ return ++len;} );
			ok( len === 2, "arr."+mth+"( function(){ return ++len;} )" );
		}
		
		var arr2 = ["a"];
		arr2[mth](function(item, idx, a){
				ok(item === 'a', "Iterator parameters test - first parameter should be 'a'");
				ok(idx === 0, "Iterator parameters test - second parameter should be 0");
				ok(a === arr2, "Iterator parameters test - third parameter should be an array");
				ok(this === utils.global, "Iterator function test - this should point to a global object");
			});
		
		var obj = {};
		arr2[mth](function(){
				ok(this === obj, "Iterator function test - this should point to obj");
			}, obj);
		
		ok( Array.prototype[mth].length === 1, "Method length should be 1" );
		ok( utils.assertError(function(){ arr2[mth](123); }), mth+" with non-function argument shoudl return an error" );
	},
	
	/**
	 * Returns true if array contains a value; false otherwise
	 * @param {Array} arr an array
	 * @param {any} val a value
	 * @returns {boolean}
	 */
	contains: function(arr, val){
		for(var i=0, len=arr.length; i < len; ++i){
			if( arr[i] === val ) {
				return true;
			}
		}
		return false;
	}
};


//-----------------------------------------------------------------
// Function.prototype tests

test( "Function.prototype.bind", function(){

	ok( Function.prototype.bind, "Bind existence veryfication" );

	var obj = { msg: "in", test: function(txt){ return txt || this.msg;} };
	var fun1 = obj.test.bind( obj );
	var fun2 = obj.test.bind( obj, "out" );
	
	ok( fun1() === "in", "fun1 with no param" );
	ok( fun1("out") === "out", "fun1 with 'out' param" );
	ok( fun2() === "out", "fun2 with no param" );
	ok( fun2() === "out", "fun2 with param" );

	ok( utils.assertError(function(){obj.msg.bind.call(new Object())}), "obj.msg.bind.call(new Object()) should throw an error" );
	
});


//-----------------------------------------------------------------
// Object tests

test( "Object.keys", function(){
	
	ok( Object.keys, "method existence veryfication" );
	
	var obj = { msg: "in", test: function(txt){ return txt || this.msg;} };
	
	ok( utils.compareArrays(Object.keys(obj), ["msg","test"]), "Object.keys(obj)" );
	ok( utils.assertError(function(){ Object.keys(5);}), "number primitive" );
	ok( !utils.assertError(function(){ Object.keys(new Number(5));}), "number object" );
	ok( utils.assertError(function(){ Object.keys();}), "no arguments" );
	ok( !utils.assertError(function(){ Object.keys(function(){});}), "function" );
	ok( utils.contains(Object.keys(new String("abc")), "1"), "String");
	raises( function(){ Object.keys("abc", "1"); }, TypeError );
	ok( !utils.assertError(function(){ Object.keys(window); }), "global" );
	ok( !utils.contains(Object.keys(Array.prototype), "slice"), "not-enumerable method");
	
} );


test( "Object.getPrototypeOf", function(){
	
	ok( Object.getPrototypeOf, "method existence veryfication" );
	
	var C = function(){};
	
	ok( Object.getPrototypeOf([]) === Array.prototype, "Array" );
	ok( utils.assertError( function(){ Object.getPrototypeOf(); }), "no arguments" );
	ok( Object.getPrototypeOf(new C()) === C.prototype, "Custom type" );
});
	

test( "Object.create", 6, function(){
	
	ok( Object.create, "method existence veryfication" );
	
	var proto = { test: "ECMAScript5" };
	var copy = Object.create( proto );
	
	ok( proto.constructor === copy.constructor, "Both object should share the same constructor" );
	
	if( proto.__proto__ )
		ok( Object.getPrototypeOf(copy) === proto, "The original object should be a prototype of a new object" );
	else {
		proto.test2 = "DDR-Ecma5";
		ok( copy.test2 && !copy.hasOwnProperty("test2"), "The original object should be a prototype of a new object" );
	}
	
	ok( copy !== proto, "New object itself shouldn't be a reference to original object" );
	ok( !copy.hasOwnProperty("test"), "Prototype attribute shouldn't be an own attribute of new object" );
	ok( utils.assertError(function(){ Object.create(); }), "Object.create without object attribute should throw exception" );
});


test( "Object.isSealed", function(){
	
	ok( Object.isSealed, "method existence veryfication" );
	ok( Object.isSealed({}) === false, "Object.isSealed({}) === false" );
	if( Object.seal ) {
		ok( Object.isSealed(Object.seal({})) === true, "Object.isSealed(Object.seal({})) === true" );
	}
	ok( utils.assertError(function(){Object.isSealed(123)}), "Object.isSealed with non-object argument should throw TypeError" );
	
});


test( "Object.isFrozen", function(){
	
	ok( Object.isFrozen, "method existence veryfication" );
	ok( Object.isFrozen({}) === false, "Object.isFrozen({}) === false" );
	if( Object.freeze ) {
		ok( Object.isFrozen(Object.freeze({})) === true, "Object.isFrozen(Object.freeze({})) === true" );
	}	
	ok( utils.assertError(function(){Object.isFrozen(123)}), "Object.isFrozen with non-object argument should throw TypeError" );
	
});


test( "Object.isExtensible", function(){
	
	ok( Object.isExtensible, "method existence veryfication" );
	ok( Object.isExtensible({}) === true, "Object.isExtensible({}) === true" );
	if( Object.seal ) {
		ok( Object.isExtensible(Object.seal({})) === false, "Object.isExtensible(Object.seal({})) === false" );
	}	
	ok( utils.assertError(function(){Object.isExtensible(123)}), "Object.isFrozen with non-object argument should throw TypeError" );
	
});


test( "Object.getOwnPropertyDescriptor", 17, function(){
	
	ok( Object.getOwnPropertyDescriptor, "method existence veryfication" );
	
	var dsc = Object.getOwnPropertyDescriptor( {test:5}, "test" );
	ok( dsc.value === 5, 'Object.getOwnPropertyDescriptor({test:5}, "test").value === 5' );
	ok( dsc.writable === true, 'Object.getOwnPropertyDescriptor({test:5}, "test").writable === true' );
	ok( dsc.enumerable === true, 'Object.getOwnPropertyDescriptor({test:5}, "test").enumerable === true' );
	ok( dsc.configurable === true, 'Object.getOwnPropertyDescriptor({test:5}, "test").configurable === true' );
	
	dsc = Object.getOwnPropertyDescriptor( Number, "POSITIVE_INFINITY" );
	ok( dsc.value === Number.POSITIVE_INFINITY, 'Object.getOwnPropertyDescriptor(Number, "POSITIVE_INFINITY").value === Number.POSITIVE_INFINITY' );
	ok( dsc.writable === false, 'Object.getOwnPropertyDescriptor(Number, "POSITIVE_INFINITY").writable === false' );
	ok( dsc.enumerable === false, 'Object.getOwnPropertyDescriptor(Number, "POSITIVE_INFINITY").enumerable === false' );
	ok( dsc.configurable === false, 'Object.getOwnPropertyDescriptor(Number, "POSITIVE_INFINITY").configurable === false' );	
	
	dsc = Object.getOwnPropertyDescriptor( [], "length" );
	ok( dsc.writable === true, 'Object.getOwnPropertyDescriptor([], "length").writable === true' );
	ok( dsc.enumerable === false, 'Object.getOwnPropertyDescriptor([], "length").enumerable === false' );
	ok( dsc.configurable === false, 'Object.getOwnPropertyDescriptor([], "length").configurable === false');
	
	dsc = Object.getOwnPropertyDescriptor( Math, "PI" );
	ok( dsc.writable === false, 'Object.getOwnPropertyDescriptor(Math, "PI").writable === false' );
	ok( dsc.enumerable === false, 'Object.getOwnPropertyDescriptor(Math, "PI").enumerable === false' );
	ok( dsc.configurable === false, 'Object.getOwnPropertyDescriptor(Math, "PI").configurable === false');
	
	dsc = Object.getOwnPropertyDescriptor( {}, "non-exisiting" );
	ok( dsc === void 0, 'Object.getOwnPropertyDescriptor( {}, "non-exisiting" ) === undefined' );
	
	raises( function(){
		dsc = Object.getOwnPropertyDescriptor(123, 'valueOf');
	}, TypeError, "Object.getOwnPropertyDescriptor(123, 'valueOf') should throw exception" );
});



test( "Object.defineProperty", function(){
	ok( Object.defineProperty, "method existence veryfication" );
	
	var obj = {};
	Object.defineProperty(obj, "test", {value: 5, writable: true, configurable: true, enumerable: true});
	ok( obj.test === 5, "Property added using defineProperty" );
	
	obj.name = "DDR-ECMA5";
	Object.defineProperty(obj, "name", {value: "ok"});
	ok( obj.name === "ok", "Property value changed using defineProperty" );

	raises( function(){
		Object.defineProperty(obj, 'test', 'non-object');
	}, TypeError, "Object.defineProperty(obj, 'test', 'non-object') should throw TypeError" );	
	
	raises( function(){
		Object.defineProperty(123, 'test', {});
	}, TypeError, "Object.defineProperty(123, 'test', {}) should throw TypeError" );	
	
	raises( function(){
		Object.defineProperty(obj, 'test2', {value: 1, get: function(){}});
	}, TypeError, "Object.defineProperty(obj, 'test2', {value: 1, get: function(){}}) should throw TypeError (not allowed to have getter and value at the same time)" );
	
	raises( function(){
		Object.defineProperty(obj, 'test3', {value: 1, set: function(){}});
	}, TypeError, "Object.defineProperty(obj, 'test2', {value: 1, set: function(){}}) should throw TypeError (not allowed to have setter and value at the same time)" );
	
	raises( function(){
		Object.defineProperty(obj, 'test4', {writable: true, get: function(){}});
	}, TypeError, "Object.defineProperty(obj, 'test2', {writable: false, set: function(){}}) should throw TypeError (not allowed to have getter and writable flag at the same time)" );
	
	raises( function(){
		Object.defineProperty(obj, 'test5', { get: 123 });
	}, TypeError, "Object.defineProperty(obj, 'test5', { get: 123 }) should throw TypeError (getter/setter must be a callable object)" );
	
	
	// DDR_Ecma5 only
	if( Object.defineProperty.DDRECMA5 ) {
		raises( function(){
			Object.defineProperty(obj, 'test6', {value: 1});
		}, TypeError, "Object.defineProperty(obj, 'test6', {value: 1}) should throw TypeError because DDREcma5 won't be able to set flags to false" );
		
		raises( function(){
			Object.defineProperty(obj, 'test7', {configurable: true, enumerable: true, get:function(){}, set:function(){}});
		}, TypeError, "Object.defineProperty(obj, 'test7', {configurable: true, enumerable: true, get:function(){}, set:function(){}}) should throw TypeError because DDREcma5 doesn't support accessors" );		
	}
});


test( "Object.defineProperties", 7, function(){
	ok( Object.defineProperties, "method existence veryfication" );
	
	var obj = { y:1 };
	Object.defineProperties(obj, {x:{value:5,writable: true, enumerable: true, configurable: true},
		y:{value: 10}});
	ok( obj.x === 5, "obj.x creation" );
	ok( obj.y === 10, "obj.y value redefinition"  );
	
	raises( function(){
		dsc = Object.defineProperties(obj, {x:{value:7}, z:{get:123}});
	}, TypeError, "method trows error when one of property descriptors is wrong" );
	
	ok( obj.x === 5, "When there is a single wrong property descriptor not of the atributes in the object should change" );
	
	raises( function(){
		Object.defineProperties(obj, {x:'abc'});
	}, TypeError, "Object.defineProperties(obj, {x:'abc'}) should throw TypeError" );	
	
	raises( function(){
		Object.defineProperties(123, {});
	}, TypeError, "Object.defineProperties(123, {}) should throw TypeError" );		
});


test( "Object.getOwnPropertyNames", 16, function(){
	ok( Object.getOwnPropertyNames, "method existence veryfication" );
	
	raises( function(){
		Object.getOwnPropertyNames('non-object');
	}, TypeError, "Object.getOwnPropertyNames('non-object') should throw TypeError" );
	
	var names = Object.getOwnPropertyNames([]);
	ok( utils.contains(names, "length"), "Object.getOwnPropertyNames([ ]) must contain a 'length' attribute" );
	
	names = Object.getOwnPropertyNames(new String('abc'));
	ok( utils.contains(names, "length"), "Object.getOwnPropertyNames(new String('abc')) must contain a 'length' attribute" );
	ok( utils.contains(names, "1"), "Object.getOwnPropertyNames(new String('abc')) must contain a '1' attribute" );
	
	names = Object.getOwnPropertyNames(Math);
	ok( utils.contains(names, "PI"), "Object.getOwnPropertyNames(Math) must contain a 'PI' attribute" );
	ok( utils.contains(names, "cos"), "Object.getOwnPropertyNames(Math) must contain a 'cos' attribute" );
	ok( !utils.contains(names, "constructor"), "Object.getOwnPropertyNames(Math) must not contain a 'constructor' attribute" );
	
	names = Object.getOwnPropertyNames(Object);
	ok( utils.contains(names, "prototype"), "Object.getOwnPropertyNames(Object) must contain a 'prototype' attribute" );
	ok( utils.contains(names, "create"), "Object.getOwnPropertyNames(Object) must contain a 'create' attribute" );
	
	names = Object.getOwnPropertyNames(Date.prototype);
	ok( utils.contains(names, "constructor"), "Object.getOwnPropertyNames(Date.prototype) must contain a 'constructor' attribute" );
	ok( utils.contains(names, "setTime"), "Object.getOwnPropertyNames(Date.prototype) must contain a 'setTime' attribute" );	
	
	names = Object.getOwnPropertyNames(utils.global);
	ok( utils.contains(names, "undefined"), "Object.getOwnPropertyNames(global) must contain a 'undefined' attribute" );
	ok( utils.contains(names, "parseInt"), "Object.getOwnPropertyNames(global) must contain a 'parseInt' attribute" );
	
	names = Object.getOwnPropertyNames(function(){});
	ok( utils.contains(names, "prototype"), "Object.getOwnPropertyNames(function(){}) must contain a 'prototype' attribute" );
	ok( utils.contains(names, "length"), "Object.getOwnPropertyNames(function(){}) must contain a 'length' attribute" );
	
});


//-----------------------------------------------------------------
// String.prototype tests

test( "String.prototype.trim", function(){
	
	ok( String.prototype.trim, "method existence veryfication" );
	
	var str1 = "  test ";
	
	ok( str1.trim() === 'test', "Simple trim" );
	ok( str1==='  test ', "Check whether trim modifies original object" );
	
	ok( '\n\r\ttest'.trim() === 'test', "Trim with special characters (\\n\\r\\t)" );
	ok( new String(str1).trim() === 'test', "Trim of String instance" );
});


//-----------------------------------------------------------------
// Array tests

test( "Array.isArray", function(){

	ok( Array.isArray, "method existence verification" );
	
	ok( Array.isArray([1,2]), "isArray returns true for an array" );
	ok( Array.isArray([]), "isArray returns true for an empty array" );
	ok( !Array.isArray(2), "isArray returns false for a non-array" );
	ok( !Array.isArray(null), "isArray returns false for a null" );
});

//-----------------------------------------------------------------
// Array.prototype tests

test( "Array.prototype.indexOf", function(){
	
	ok( Array.prototype.indexOf, "method existence veryfication" );

	var arr = ['a','b','c','b','d'];
	
	ok( arr.indexOf('b') === 1, "arr.indexOf('b')" );
	ok( arr.indexOf('b',2) === 3, "arr.indexOf('b',2)" );
	ok( arr.indexOf('b',-2) === 3, "arr.indexOf('b',-2)" );
	
	ok( arr.indexOf('q') === -1, "arr.indexOf('q')" );
	ok( arr.indexOf('a', -10) === 0, "arr.indexOf('a',-10)" );
	ok( arr.indexOf('a', 100) === -1, "arr.indexOf('a',100)" );
	
	arr = new Array;
	arr[4] = 'x';
	ok( arr.indexOf(undefined) === -1, "arr.indexOf(undefined)" );
	arr[3] = undefined;
	ok( arr.indexOf(undefined) === 3, "arr.indexOf(undefined)" );
	
	var C = function(val){
		this.value = val;
	};
	C.prototype.equals = function(o1, o2) {
		return o1.value === o2.value;
	};
	arr = [ new C(1), new C('A') ];
	ok( arr.indexOf(new C('A')) === -1, "arr.indexOf(new C('A')) === 1" );

	ok( Array.prototype.indexOf.length === 1, "Method length" );
});

	
test( "Array.prototype.lastIndexOf", function(){
	
	ok( Array.prototype.lastIndexOf, "method existence veryfication" );
	
	var arr = ['a','b','c','b','d'];
	
	ok( arr.lastIndexOf('b') === 3, "arr.lastIndexOf('b')" );
	ok( arr.lastIndexOf('b',2) === 1, "arr.lastIndexOf('b',2)" );
	ok( arr.lastIndexOf('b',-2) === 3, "arr.lastIndexOf('b',-2)" );
	
	ok( arr.lastIndexOf('q') === -1, "arr.lastIndexOf('q')" );
	ok( arr.lastIndexOf('a', -10) === -1, "arr.lastIndexOf('a',-10)" );
	ok( arr.lastIndexOf('a', 100) === 0, "arr.lastIndexOf('a',100)" );

	arr = new Array;
	arr[4] = 'x';
	ok( arr.lastIndexOf(undefined) === -1, "arr.lastIndexOf(undefined)" );
	arr[3] = undefined;
	ok( arr.lastIndexOf(undefined) === 3, "arr.lastIndexOf(undefined)" );
	
	ok( Array.prototype.lastIndexOf.length === 1, "Method length" );
});	


test( "Array.prototype.every", function(){

	utils.arrayMethodTest("every");

    var arr = new Array(5);
	arr[1] = 2; arr[4] = 5;
	var len = 0;

	ok( [].every( function(){return true;} ) === true, "every on empty array" );
	ok( [].every( function(){return false;} ) === true, "every on empty array" );

	var fn = function(item, idx, arr) {
		idx < 20 && arr.push(0);
		++len;
		return true;
	};
	
	len = 0;
	ok( arr.every(fn) === true, "Array which pushes zero at the end for each iteration" );
	ok( len === 2, "len again"  );
	ok( arr.length === 7, "Array.lenght should be modified after" );
	
	arr.length = 5;
	fn = function(item, idx, arr) {
		arr[idx+1] = false;
		return item;
	};
	ok( arr.every(fn) === false, "");
	ok( utils.compareArrays(arr,[undefined,2,false,false,5]), "Array should be [undefined,2,false,false,5]) after last operation" );
});


test( "Array.prototype.some", function(){
	
	utils.arrayMethodTest("some");

    var arr = new Array(5);
	arr[1] = 2; arr[4] = 5;
	var len = 0;

    ok( arr.some( function(){ return ++len;} ) === true, "arr.some( function(){ return ++len;}" );
    ok( len === 1, "len" );
        
	ok( [].some( function(){return true;} ) === false, "some on empty array" );
	ok( [].some( function(){return false;} ) === false, "some on empty array" );

	var obj = { 
		data: true,
		test: function(){ return this.data; }
	};
	ok( arr.some(obj.test, obj) === true, "some with thisArg" );
	
    ok( Array.prototype.some.length === 1, "Method length" );
});


test( "Array.prototype.forEach", function(){
	utils.arrayMethodTest("forEach");
	ok( [1,2,3].forEach(function(){return 1;}) === undefined, "Result of forEach should be undefined" );
});


test( "Array.prototype.map", function(){
	utils.arrayMethodTest("map");
	
	var arr = [1,2,3,4];
	var map = arr.map(function(e){ return e+1; });
	ok( utils.compareArrays([2,3,4,5],map), "[1,2,3,4].map(function(e){ return e+1; }) should return [2,3,4,5]" );
});


test( "Array.prototype.filter", function(){
	utils.arrayMethodTest("filter");
	
	var arr = [1,2,3,4,5,6];
	var r = arr.filter( function(i){ return !(i%2);} );
	ok( utils.compareArrays(r, [2,4,6]), "arr.filter( function(i){ return !i%2;} ) should return [2,4,6]" );
});


test( "Array.prototype.reduce", function(){
	
	ok( Array.prototype.some, "method existence veryfication" );
	
	var arr = ['a','b'], i = 0;
	var res = arr.reduce(function(prv, curr, idx, a){
		if( i++ === 0) {
			ok(prv === 'a', "Iterator parameters test - first parameter should be 'a'");
			ok(curr === 'b', "Iterator parameters test - second parameter should be 'b'");
			ok(idx === 1, "Iterator parameters test - third parameter should be 1");
			ok(a === arr, "Iterator parameters test - fourth parameter should an array itself");
		}
	});
	ok( res === undefined, "Res should be undefined");
	
	ok( utils.assertError(function(){arr.reduce(123);}), "Reduce with non-function argument should throw an error" );
	
	ok( [42].reduce(function(){return 24;}) === 42, "Reduce on one-element array (without initial val) should return the element" );
	ok( utils.assertError( function(){[].reduce(function(){return 24;});} ), "Reduce on empty array (without initial val) should throw type error" );
	ok( [].reduce(function(){return 24;}, 42) === 42, "Reduce on empty array (with initial val) should return the initial value itself" );

	var arr = ['a','b','c','d'];
	res = arr.reduce( function(prv, curr){return prv+curr;} );
	ok( res === 'abcd', "['a','b','c','d'].reduce( function(prv, curr){return prv+curr;} ) should return 'abcd' string" );
	
	res = arr.reduce( function(prv, curr){return prv+curr;}, "0" );
	ok( res === '0abcd', "['a','b','c','d'].reduce( function(prv, curr){return prv+curr;}, '0' ) should return '0abcd' string" );
	
	arr = new Array(10);
	arr[4] = 42;
	strictEqual( arr.reduce(function(){return 24;}), 42, "Array with undefined elements. Reduce on one-element array (without initial val) should return the element" );
	strictEqual( arr.reduce(function(){return 24;}, 0 ), 24, "Array with undefined elements. Reduce on one-element array (without initial val) should return the element" );
	
	raises((new Array(10)).reduce.bind(function(){}), TypeError, "Reduce on array without initialized elements should throw type error" );
});


test( "Array.prototype.reduceRight", function(){
	ok( Array.prototype.some, "method existence veryfication" );
	
	var arr = ['a','b'], i = 0;
	var res = arr.reduceRight(function(prv, curr, idx, a){
		if( i++ === 0) {
			ok(prv === 'b', "Iterator parameters test - first parameter should be 'b'");
			ok(curr === 'a', "Iterator parameters test - second parameter should be 'a'");
			ok(idx === 0, "Iterator parameters test - third parameter should be 0");
			ok(a === arr, "Iterator parameters test - fourth parameter should an array itself");
		}
	});
	ok( res === undefined, "Res should be undefined");
	
	ok( utils.assertError(function(){arr.reduceRight(123);}), "reduceRight with non-function argument should throw an error" );
	
	ok( [42].reduceRight(function(){return 24;}) === 42, "reduceRight on one-element array (without initial val) should return the element" );
	ok( utils.assertError( function(){[].reduceRight(function(){return 24;});} ), "reduceRight on empty array (without initial val) should throw type error" );
	ok( [].reduceRight(function(){return 24;}, 42) === 42, "reduceRight on empty array (with initial val) should return the initial value itself" );

	var arr = ['a','b','c','d'];
	res = arr.reduceRight( function(prv, curr){return prv+curr;} );
	ok( res === 'dcba', "['a','b','c','d'].reduceRight( function(prv, curr){return prv+curr;} ) should return 'abcd' string" );
	
	res = arr.reduceRight( function(prv, curr){return prv+curr;}, "0" );
	ok( res === '0dcba', "['a','b','c','d'].reduceRight( function(prv, curr){return prv+curr;}, '0' ) should return '0abcd' string" );
	
	arr = new Array(10);
	arr[4] = 42;
	ok( arr.reduceRight(function(){return 24;}) === 42, "Array with undefined elements. reduceRight on one-element array (without initial val) should return the element" );
	ok( arr.reduceRight(function(){return 24;}, 0 ) === 24, "Array with undefined elements. reduceRight on one-element array (without initial val) should return the element" );
	
	ok( utils.assertError( function(){new Array(10).reduceRight(function(){});} ), "reduceRight on array without initialized elements should throw type error" );
});


//-----------------------------------------------------------------
// Date.prototype and Date tests

test( "Date.prototype.toISOString", function(){
	ok( Date.prototype.toISOString, "method existence veryfication" );

	var d = new Date().toISOString();
	ok( d.length === 24 || d.length === 20, "ISO Date string should be 24 characters long" );
	ok( d.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/), "toISOString() result matches /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/ pattern" );
	
	var zd = new Date(0).toISOString(); 
	ok( zd === '1970-01-01T00:00:00.000Z' || zd === '1970-01-01T00:00:00Z', "new Date(0).toISOString() should return '1970-01-01T00:00:00.000Z' or '1970-01-01T00:00:00Z'" );
	ok( new Date(Infinity).toISOString() === 'Invalid Date', "new Data(Infinity).toISOString() should return 'Invalid Date'" );
	ok( new Date(NaN).toISOString() === 'Invalid Date', "new Data(NaN).toISOString() should return 'Invalid Date'" );
});


test( "Date.prototype.toJSON", function() {
	ok( Date.prototype.toJSON, "method existence verification" );
	ok( typeof Date.prototype.toJSON === 'function', "Date.prototype.toJSON should be a function" );
	
	var d = new Date().toJSON();
	ok( d.length === 24 || d.length === 20, "ISO Date string should be 24 characters long" );
	ok( d.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/), "toJSON() result matches /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/ pattern" );
	
	var zd = new Date(0).toJSON(); 
	ok( zd === '1970-01-01T00:00:00.000Z' || zd === '1970-01-01T00:00:00Z', "new Date(0).toJSON() should return '1970-01-01T00:00:00.000Z' or '1970-01-01T00:00:00Z'" );
	
	// most of the browsers gives error here ("Invalid date") which is not right according to ECMAScript 5 Specification
	ok( new Date(Infinity).toJSON() === null, "new Data(Infinity).toJSON() should be null" );
	// most of the browsers gives error here ("Invalid date") which is not right according to ECMAScript 5 Specification
	ok( new Date(NaN).toJSON() === null, "new Data(NaN).toJSON() should be null" );
	
	// most of the browser won't allow to use other types than Date here, some of them even throw an exception
	// but the ECMAScript 5 specification says such situation should return null
	try {
		ok( new Date(0).toJSON.call('abc') === null, "new Date(0).toJSON.call('abc') should be null" );
	} catch(e){/*ignore*/}
});


test( "Date.now", function() {
	ok( Date.now, "method existence veryfication" );
	ok( typeof Date.now === 'function', "Date.now should be a function" );
	
	var now = Date.now(), date = new Date().getTime();
	ok( typeof now === 'number', "type of Date.now result should be a number" );
	ok( now - date < 1000, "Date.now() and new Date().getTime() should be equal" );
});

