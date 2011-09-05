
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
  }
];

var fibonacci = function(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};

var fibonacci = fibonacci.cache()