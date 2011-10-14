module('Object');

test('Object.is', function() {
  ok(!Object.is(0,-0));
  ok(Object.is(NaN,NaN));
  ok(!Object.is(true,false));
  ok(Object.is(true,true));
});

test('Object.follow', function () {
  var obj = {a:{b:{c:'d'}}};
  strictEqual(Object.follow(obj, ['a', 'b', 'c']), 'd');
  strictEqual(Object.follow(obj, ['a', 'c']), undefined);
  strictEqual(Object.follow(obj, ['a', 'b']), obj.a.b);
  strictEqual(Object.follow(obj, 'a.b'), obj.a.b);
  strictEqual(Object.follow(obj, 'a,b', ','), obj.a.b);
});

test('Object.clone', function () {

  function a() { }
  Object.defineProperties(a.prototype, { foo: { value: 'bar' } });

  var obj = new a();
  obj.boo = 'baz';
  
  var clone = Object.clone(obj);
  obj.bar = 'baz';
  
  equal(clone.foo, 'bar');
  equal(clone.bar, undefined);
  equal(clone.boo, 'baz');

  a.prototype.bat = 'foo';

  equal(clone.bat, 'foo');

  ok(clone instanceof a);
  ok(obj !== clone);
});

test('Object.values', function () {
  deepEqual(Object.values({1:2,3:4}), [2,4]);
});
  
test('Object.isObject', function () {
  ok(Object.isObject({}));
  ok(Object.isObject(new (function () { })));
  equal(Object.isObject(123), false);
});
  
test('Object.each', function () {
  
  var j = 0, r = Object.each({ foo: 1, bar: 2, baz: 3 }, function (key, val) {
    j = key; if (val == 2) return 'foo';
  });
  
  strictEqual(r,'foo');
  strictEqual(j,'bar');
});
  
test('Object.map', function () {
  
  var obj = Object.create(Object.prototype, {
    2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
    3: { value: 4, enumerable: true, writable: true },  // Test Normal
    5: { value: 6, enumerable: false }          // Test non-enumerable values
  });
    
  obj = Object.map(obj, function (key, val) { return key * val });

  deepEqual(Object.values(obj), [2,12]);
  deepEqual(Object.keys(obj), ['2','3']);
  deepEqual(obj[5], 6);
});
  
test('Object.map$', function () {
  
  var obj = Object.create(Object.prototype, {
    2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
    3: { value: 4, enumerable: true, writable: true },  // Test Normal
    5: { value: 6, enumerable: false }          // Test non-enumerable values
  });
    
  strictEqual(Object.map$(obj, function (key, val) { return key * val }), obj);
  deepEqual(Object.values(obj), [2,12]);
  deepEqual(Object.keys(obj), ['2','3']);
  deepEqual(obj[5], 6);
});
  
test('Object.getOwnPropertyDescriptors', function () {
  
  var desc = {
    bar: 
     { value: function () { },
     writable: false,
     enumerable: false,
     configurable: false },
    foo: 
     { value: 'foo',
     writable: false,
     enumerable: false,
     configurable: false } };
     
  var obj = Object.create(Object.prototype, desc);
  
  deepEqual(Object.getOwnPropertyDescriptors(obj), desc);
});
  
test('Object.merge', function () {
  
  var a = {
    a: { b: 'c' },
    d: 'e'
  }
  
  var b = {
    a: { b: 'b', c: 'e' },
    d: 'f'
  };
  
  deepEqual(Object.merge(b,a), {a:{b:'c'},d:'e'});
  deepEqual(Object.merge([b,a],-1), {a:{b:'c',c:'e'},d:'e'});
});
  
test('Object.filter', function () {
  
  var obj = Object.create({}, {
    1: { value: 2, enumerable: true, configurable: true },
    3: { value: 4, enumerable: true, configurable: true },
    4: { value: 4, enumerable: true, configurable: true },
    5: { value: 6, enumerable: false, configurable: true }
  });
  
  var a = Object.filter(obj, function (key, val) { return val==4 || key == 1; }),
      b = Object.filter(obj, [1,3,'4']);
      
  deepEqual(Object.keys(a), ['1','3','4']);
  deepEqual(Object.values(a), [2,4,4]);
  
  deepEqual(Object.keys(b), ['1','3','4']);
  deepEqual(Object.values(a), [2,4,4]);
     
  equal(Object.filter(obj, [1,3,'4'])[5], 6);
});
  
test('Object.filter$', function () {
  
  var obj = Object.create({}, {
    1: { value: 2, enumerable: true, configurable: true },
    3: { value: 4, enumerable: true, configurable: true },
    4: { value: 4, enumerable: true, configurable: true },
    5: { value: 6, enumerable: false, configurable: true }
  });
  
  strictEqual(Object.filter$(obj, function (key, val) { return val==4 || key == 1; }), obj);
      
  deepEqual(Object.keys(obj), ['1','3','4']);
  deepEqual(Object.values(obj), [2,4,4]);
  
  strictEqual(Object.filter$(obj, [1,'3']), obj);
  deepEqual(Object.keys(obj), ['1','3']);
  deepEqual(Object.values(obj), [2,4]);
  
});
  
test('Object.clean', function () {
  var obj = Object.clean({1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'});
  deepEqual(Object.keys(obj), ['6','7']);
  deepEqual(Object.values(obj), ['foo','bar']);
});
  
test('Object.clean$', function () {
  var obj = {1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'};
  strictEqual(Object.clean$(obj), obj);
  deepEqual(obj, {6:'foo',7:'bar'});
});
  
test('Object.alias', function () {
  
  var obj = {
    a: 'b',
    fooVal: 'bar',
    foo: 'bar'
  };
  
  Object.alias(obj, 'foo', 'bat');
  
  if (Object.prototype.__looupGetter__) {
    Object.alias(obj, 'a', 'b', true);
    strictEqual(obj.a, obj.b);
    obj.a = 'bar';
    strictEqual(obj.a, obj.b);
    obj.b = 'bar';
    strictEqual(obj.a, obj.b);
  }
  
  strictEqual(obj.bat, obj.foo);
  obj.bat = 'bar';
  strictEqual(obj.bat, obj.foo);
});
  
test('Object.size', function () {
  strictEqual(Object.size({1:2,3:4,5:6}), 3);
});
  
test('Object.merge$', function () {
  
  var obj = {1:2,3:4,5:6};
  
  strictEqual(Object.merge$(obj, {6:7}), obj);
  deepEqual(obj, {1:2,3:4,5:6,6:7})
});
  
test('Object.UUID', function () {
  
  var a = {}, b = {};
  
  strictEqual(Object.id(a), Object.id(a));
  notEqual(Object.id(a), Object.id(b));
});

/* ECMA5 Polyfil Tests */

test('Object.defineProperty', function () {
  
  var obj = {};
  
  Object.defineProperty(obj, 'test', {value: 5, writable: true, configurable: true, enumerable: false});
  strictEqual(obj.test, 5); // 1
    
  Object.defineProperty(obj, 'name', {value: 'ok'});
  strictEqual(obj.name, 'ok'); // 2
  
  raises(Object.defineProperty.bind(null, obj, 'name', 'string'), TypeError); // 3
  raises(Object.defineProperty.bind(null, obj, 'name', 1), TypeError); // 4
  raises(Object.defineProperty.bind(null, obj, 'name', {value:1,get:function (){}}), TypeError); // 6
  raises(Object.defineProperty.bind(null, obj, 'name', {value:1,set:function (){}}), TypeError); // 7
  raises(Object.defineProperty.bind(null, obj, 'name', {writable:true,get:function (){}}), TypeError); // 8
  raises(Object.defineProperty.bind(null, obj, 'name', {get:123}), TypeError); // 9
});

test('Object.getOwnPropertyDescriptor', function () {
  
  var a = Object.create(Object.prototype, {
    a: { value: 'a' },
    b: { value: 'b', enumerable: true },
    c: { value: 'c', enumerable: true }
  });
    
  deepEqual(Object.getOwnPropertyDescriptor(a, 'b'), {value:'b',enumerable:true,writable:false,configurable:false});
});

test('Object.getOwnPropertyNames', function () {

  var a = Object.create(Object.prototype, {
    a: { value: 'a' },
    b: { value: 'b', enumerable: true },
    c: { value: 'c', enumerable: true }
  });
  
  var b = Object.create(a, {
    d: { value: 'd' },
    e: { value: 'e', enumerable: true },
    f: { value: 'f', enumerable: true }
  });

  ok(Object.getOwnPropertyNames(b).contains('d','e','f'));
});

test('Object.keys', function () {
  var obj = Object.create(Object.prototype, {
    a: { value: 'a' },
    b: { value: 'b', enumerable: true },
    c: { value: 'c', enumerable: true }
  });
    
  ok(Object.keys(obj).contains('b','c'));
});