
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
      1: { value: 2, enumerable: true },
      3: { value: 4, enumerable: true },
      5: { value: 6, enumerable: false }
    });
        
    obj = Object.map(obj, function(key, val) { return key * val });
    
    result(JSON.stringify(obj), '{"1":2,"3":12}', 'Normal');
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

    result(Object.clone(obj).foo, 'bar', 'Property construction');
    result(Object.clone(obj) instanceof A, true, 'instanceof Operator');
    result(obj === Object.clone(obj), false, 'Negative equality');
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
  
  function Clean(result) {
    
    var obj = Object.clean({1:undefined, 2:null, 3:false, 4:0, 5:NaN, 6:'foo', 7:'bar'});
    
    result(JSON.stringify(obj), '{"6":"foo","7":"bar"}', 'Normal');
  }
];