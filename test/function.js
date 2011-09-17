require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'Function.compose': function() {
    
    function a(val) { return val ^ 2; }
    function b(val) { return val / 2; }
    
    var c = Function.compose(a,b);
    
    assert.strictEqual(a(b(5)), c(5));
  },
  
  'Function#cache': function() {
    
    var value = 1, getVal = (function() { return value; }).cache();
    
    assert.strictEqual(getVal(), 1);
    value = 2;
    
    setTimeout(function() {
      
      assert.strictEqual(getVal(), 1);
      assert.strictEqual(getVal(1), 2);
      
      var getValueTimeOut = function() { return value; }.cache(20);
      
      getValueTimeOut();
      value = 3;

      setTimeout(function() { assert.strictEqual(getValueTimeOut(), 2); }, 10);
      setTimeout(function() { assert.strictEqual(getValueTimeOut(), 3); }, 50);
      
    }, 5);
  },
  
  'Function#delay': function() {
    
    var called = false;
    
    Date.now.delay(function(now, then, foo) {
      
      called = true;
      
      assert.ok(Math.abs(now - then - 50) < 2);
      assert.strictEqual(foo, 'foo');
      
    }, 50, Date.now(), 'foo');
    
    setTimeout(function() {
      
      assert.ok(called);
      
    }, 100)
  },
  
  'Function#once': function() {
    
    var value = 3, once = function() { return value; }.once();
    assert.strictEqual(once(), 3);
    value = 4;
    assert.strictEqual(once(), 3);
    assert.strictEqual(once(1), 3);
  }
}