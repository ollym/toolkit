require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'Object.values': function() {
    assert.eql(Object.values({1:2,3:4}), [2,4]);
  },
  
  'Object.isObject': function() {
    assert.ok(Object.isObject({}));
    assert.ok(Object.isObject(new (function() { })));
    assert.equal(Object.isObject(function() { }), false);
  },
  
  'Object.each': function() {
    
    var j = 0, r = Object.each({ foo: 1, bar: 2, baz: 3 }, function(key, val) {
      j = key; if (val == 2) return 'foo';
    });
    
    assert.strictEqual(r,'foo');
    assert.strictEqual(j,'bar');
  },
  
  'Object.map': function() {
    
    var obj = Object.create(Object.prototype, {
      2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
      3: { value: 4, enumerable: true, writable: true },  // Test Normal
      5: { value: 6, enumerable: false }                  // Test non-enumerable values
    });
        
    obj = Object.map(obj, function(key, val) { return key * val });

    assert.eql(obj, {2:2,3:12});
    assert.eql(obj[5], 6);
  },
  
  'Object.map$': function() {
    
    var obj = Object.create(Object.prototype, {
      2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
      3: { value: 4, enumerable: true, writable: true },  // Test Normal
      5: { value: 6, enumerable: false }                  // Test non-enumerable values
    });
        
    assert.strictEqual(Object.map$(obj, function(key, val) { return key * val }), obj);
    assert.eql(obj, {2:2,3:12});
    assert.eql(obj[5], 6);
  },
  
  'Object.getOwnPropertyDescriptors': function() {
    
    desc = {
      bar: 
       { value: function() { },
         writable: false,
         enumerable: false,
         configurable: false },
      foo: 
       { value: 'foo',
         writable: false,
         enumerable: false,
         configurable: false } };
         
    var obj = Object.create(Object.prototype, desc);
    
    assert.eql(Object.getOwnPropertyDescriptors(obj), desc);
  },
  
  'Object.merge': function() {
    
    var a = {
      a: { b: 'c' },
      d: 'e'
    }
    
    var b = {
      a: { b: 'b', c: 'e' },
      d: 'f'
    };
    
    assert.eql(Object.merge(b,a), {a:{b:'c'},d:'e'});
    assert.eql(Object.merge([b,a],-1), {a:{b:'c',c:'e'},d:'e'});
  },
  
  'Object.clone': function() {
    
    function a() { }
    Object.defineProperties(a.prototype, { foo: { value: 'bar' } });
    
    var obj = new a();
    obj.boo = 'baz';
    
    var clone = Object.clone(obj);
    obj.bar = 'baz';
    
    assert.equal(clone.foo, 'bar');
    assert.equal(clone.bar, undefined);
    assert.equal(clone.boo, 'baz');
    
    a.prototype.bat = 'foo';
    
    assert.equal(clone.bat, 'foo');
    
    assert.ok(clone instanceof a);
    assert.ok(obj !== clone);
  },
  
  'Object.filter': function() {
    
    var obj = Object.create({}, {
      1: { value: 2, enumerable: true },
      3: { value: 4, enumerable: true },
      5: { value: 6, enumerable: false }
    });
    
    var obj = Object.filter(obj, function(key, val) { return val==4 || key == 1; });
    
    assert.eql(obj, {1:2,3:4});
    assert.equal(obj[5], 6);
  },
  
  'Object.filter$': function() {
    
    var obj = Object.create({}, {
      1: { value: 2, enumerable: true },
      3: { value: 4, enumerable: true },
      5: { value: 6, enumerable: false }
    });
    
    assert.strictEqual(Object.filter$(obj, function(key, val) { return val==4 || key == 1; }), obj);
    assert.eql(obj, {1:2,3:4});
  },
  
  'Object.clean': function() {
    var obj = Object.clean({1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'});
    assert.eql(obj, {6:'foo',7:'bar'});
  },
  
  'Object.clean$': function() {
    var obj = {1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'};
    assert.strictEqual(Object.clean$(obj), obj);
    assert.eql(obj, {6:'foo',7:'bar'});
  },
  
  'Object.alias': function() {
    
    var obj = {
      a: 'b',
      fooVal: 'bar',
      get foo() {
        return this.fooVal;
      },
      set foo(val) {
        this.fooval = val;
      }
    };
    
    Object.alias(obj, 'foo', 'bat');
    Object.alias(obj, 'a', 'b', true);

    assert.strictEqual(obj.a, obj.b);
    obj.a = 'bar';
    assert.strictEqual(obj.a, obj.b);
    
    assert.strictEqual(obj.bat, obj.foo);
    obj.bat = 'bar';
    assert.strictEqual(obj.bat, obj.foo);
    
    obj.b = 'bar';
    assert.strictEqual(obj.a, obj.b);
  },
  
  'Object.size': function() {
    assert.strictEqual(Object.size({1:2,3:4,5:6}), 3);
  },
  
  'Object#__objectHash__': function() {
    
    function a() { }
    a.prototype = { foo: 'bar' };
    
    var obj = new a();
    
    assert.strictEqual(obj.__objectHash__, obj.__objectHash__);
    assert.notEqual(obj.__objectHash__, a.__objectHash__);
  }
};