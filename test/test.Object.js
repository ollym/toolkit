
module.exports = [

  function Values(result) {
    
    result(Object.values({ 1:2, 3:4 }), '2,4', 'Normal');
  },
  
  function isObject(result) {
    
    result(Object.isObject({}), true, "Normal");
    result(Object.isObject(new (function() { })), true, "Instantiated");
    result(Object.isObject(function() { }), false, "Function");
  },
  
  function Each(result) {
    
    var j = 0;
    var ret = Object.each({ foo: 1, bar: 2, baz: 3 }, function(key, val) {
      j = key;
      if (val == 2) return 'foo';
    });
    
    result(ret, 'foo', 'Return value');
    result(j, 'bar', 'Stop looping');
  },
  
  function Map(result) {
    
    var obj = Object.create({}, {
      2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
      3: { value: 4, enumerable: true, writable: true },  // Test Normal
      5: { value: 6, enumerable: false }                  // Test non-enumerable values
    });
        
    obj = Object.map(obj, function(key, val) { return key * val });
    
    result(JSON.stringify(obj), '{"2":2,"3":12}', 'Normal');
    result(obj[5], 6, 'Non-enumerable property preservation');
  },
  
  function Map$(result) {
    
    var obj = Object.create({}, {
      2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
      3: { value: 4, enumerable: true, writable: true },  // Test Normal
      5: { value: 6, enumerable: false }                  // Test non-enumerable values
    });
        
    Object.walk(obj, function(key, val) { return key * val });
    
    result(JSON.stringify(obj), '{"2":2,"3":12}', 'Normal');
    result(obj[5], 6, 'Non-enumerable property preservation');
  },
  
  function Walk(result) {
    
    var obj = Object.create({}, {
      2: { value: 2, enumerable: true, writable: false }, // Test non-writable values
      3: { value: 4, enumerable: true, writable: true },  // Test Normal
      5: { value: 6, enumerable: false }                  // Test non-enumerable values
    });
        
    Object.walk(obj, function(key, val) { return key * val });
    
    result(JSON.stringify(obj), '{"2":2,"3":12}', 'Normal');
    result(obj[5], 6, 'Non-enumerable property preservation');
  },
  
  function getOwnPropertyDescriptors(result) {
    
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
    
    function A() { }
    A.prototype = Object.create({}, desc);

    result(Object.keys(Object.getOwnPropertyDescriptors(A.prototype)), 'bar,foo', 'Shallow assertion');
  },
  
  function Merge(result) {
    
    var a = {
      a: {
        b: 'c'
      },
      d: 'e'
    }
    
    var b = {
      a: {
        b: 'b',
        c: 'e'
      },
      d: 'f'
    };
    
    result(JSON.stringify(Object.merge(b, a)), '{"a":{"b":"c"},"d":"e"}', '1-Level Merge');
    result(JSON.stringify(Object.merge([b, a], -1)), '{"a":{"b":"c","c":"e"},"d":"e"}', 'Multi-Level Merge');
    result(JSON.stringify(Object.merge([a, b], 1)), JSON.stringify(Object.merge(a, b)), 'Default Params');
  },
  
  function Clone(result) {

    function A() { }
    Object.defineProperties(A.prototype, { foo: { value: 'bar' } });
    
    var obj = (new A());
    obj.boo = 'baz';
    
    var clone = Object.clone(obj);
    obj.bar = 'baz';
    
    result(clone.foo, 'bar', 'Property construction');
    result(clone.bar, undefined, 'Parent isolation');
    result(clone.boo, 'baz', 'Parent inheritance');
    
    A.prototype.bat = 'foo';
    
    result(clone.bat, 'foo', 'Prototypal inheritence');
    
    result(clone instanceof A, true, 'instanceof Operator');
    result(obj === clone, false, 'Negative equality');
  },
  
  function Filter(result) {
    
    var obj = Object.create({}, {
      1: { value: 2, enumerable: true },
      3: { value: 4, enumerable: true },
      5: { value: 6, enumerable: false }
    });
    
    var obj = Object.filter(obj, function(key, val) { return val==4 || key == 1; });
    
    result(JSON.stringify(obj), '{"1":2,"3":4}', 'Normal');
    result(obj[5], 6, 'Non-enumerable property preservation');
  },
  
  function Filter$(result) {
    
    var obj = Object.create({}, {
      1: { value: 2, enumerable: true },
      3: { value: 4, enumerable: true },
      5: { value: 6, enumerable: false }
    });
    
    Object.filter$(obj, function(key, val) { return val==4 || key == 1; });
    
    result(JSON.stringify(obj), '{"1":2,"3":4}', 'Normal');
    result(obj[5], 6, 'Non-enumerable property preservation');
  },
  
  function Clean(result) {
    
    var obj = Object.clean({1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'});

    result(JSON.stringify(obj), '{"6":"foo","7":"bar"}', 'Normal');
  },
  
  function Clean(result) {
    
    var obj = {1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'};
    
    Object.clean$(obj);

    result(JSON.stringify(obj), '{"6":"foo","7":"bar"}', 'Normal');
  },
  
  function Alias(result) {
    
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
    Object.alias(obj, 'a', 'b');

    result(obj.a, obj.b, 'Normal');
    obj.a = 'bar';
    result(obj.a, obj.b, 'Original change.');
    
    result(obj.bat, obj.foo, 'Get-variables');
    obj.bat = 'bar';
    result(obj.bat, obj.foo, 'Post-Set Get-variables');
    
    obj.b = 'bar';
    result(obj.a, obj.b, 'Reverse Post-Set');
  },
  
  function ObjectHash(result) {
    
    function A() { }
    A.prototype = { foo: 'bar' };
    
    var obj = new A();
    
    result(obj.__objectHash__, obj.__objectHash__, 'Normal');
    result(obj.__objectHash__ == A.__objectHash__, false, 'Normal');
  }
];