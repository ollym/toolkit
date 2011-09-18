module('Function')

test('Function.compose', function() {
  
  function a(val) { return val ^ 2; }
  function b(val) { return val / 2; }
  
  var c = Function.compose(a,b);
  
  strictEqual(a(b(5)), c(5));
});
  
test('Function#cache', function() {
  
  var value = 1, getVal = (function() { return value; }).cache();
  
  strictEqual(getVal(), 1);
  value = 2;
  
  setTimeout(function() {
    
    strictEqual(getVal(), 1);
    strictEqual(getVal(1), 2);
    
    var getValueTimeOut = function() { return value; }.cache(20);
    
    getValueTimeOut();
    value = 3;

    setTimeout(function() { strictEqual(getValueTimeOut(), 2) }, 10);
    setTimeout(function() { strictEqual(getValueTimeOut(), 3) }, 50);
    
  }, 5);
});
  
test('Function#delay', function() {
  
  var called = false;
  
  Date.now.delay(function(now, then, foo) {
    
    called = true;
    
    ok(Math.abs(now - then - 50) < 2);
    strictEqual(foo, 'foo');
    
  }, 50, Date.now(), 'foo');
  
  setTimeout(function() {
    
    ok(called);
    
  }, 100)
});
  
test('Function#once', function() {
  
  var value = 3, once = function() { return value; }.once();
  
  strictEqual(once(), 3);
  
  value = 4;
  
  strictEqual(once(), 3);
  strictEqual(once(1), 3);
});