
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
    
    Date.now.delay(function(now, then) {
      
      result(Math.abs(now - then - 50) < 2, true, 'Correct callback - Fuzzy');
      
    }, 50, Date.now());
  }
];