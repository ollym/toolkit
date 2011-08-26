
module.exports = [
  
  function Random(result) {
    
    var rand = Math.random(1);

    result(rand >= 1, true, 'Single-Param LB range check');
    result(rand <= 2, true, 'Single-Param UB range check');
    
    var rand = Math.random();

    result(rand >= 0, true, 'Default LB range check');
    result(rand <= 1, true, 'Default UB range check');
    
    var rand = Math.random(100, 1000);
    
    result(rand >= 100, true, 'LB range check');
    result(rand <= 1000, true, 'UB range check');
  }

];