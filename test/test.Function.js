
module.exports = [
  
  function Cache(result) {
    
    var value = 1;
    
    var getVal = function() {
      return value;
    }.cache();
    
    result(getVal(), 1, 'Set cache');
    value = 2;
    
    setTimeout(function() {
      
      result(getVal(1), 2, 'New value');
      result(getVal(), 1, 'Return from cache');
      
      var getValueTimeOut = function() {
        return value;
      }.cache(20);

      getValueTimeOut();
      value = 3;

      setTimeout(function() {
        result(getValueTimeOut(), 2, 'Timeout non-elapsed');
      }, 10);

      setTimeout(function() {
        result(getValueTimeOut(), 3, 'Timeout elapsed');
      }, 50);
    
    }, 5);
  },
  
  function Delay(result) {
    
    var called = false;
    
    Date.now.delay(function(now, then, foo) {
      
      called = true;
      
      result(Math.abs(now - then - 50) < 2, true, 'Correct callback - Fuzzy');
      result(foo, 'foo', 'Multiple parameters');
      
    }, 50, Date.now(), 'foo');
    
    setTimeout(function() {
      
      result(called, true, 'Function called');
      
    }, 100)
  },
  
  function Compose(result) {
    
    function A(val) { return val ^ 2; }
    function B(val) { return val / 2; }
    
    var C = Function.compose(A, B);
    
    result(A(B(5)), C(5), 'Normal');
  }
];