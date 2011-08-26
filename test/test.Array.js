
var assert = require('assert');

module.exports = [
  
  function Range(result) {
    
    result(Array.range(1, 5, 2).join(','), '1,3,5', 'Start, Stop & Length');
    result(Array.range(1, 3).join(','), '1,2,3', 'Start, Stop');
    result(Array.range(3).join(','), '1,2,3', 'Only Stop');
  },
  
  function Swap(result) {
    
    result(['a', 'b', 'c'].swap(2, 0).join(','), 'c,b,a', 'Normal');
    result(['a', 'b', 'c'].swap(1, 1).join(','), 'a,b,c', 'No Swap');
  },
  
  function Contains(result) {
    
    result(['a', 'b', 'c'].contains('a', 'b'), true, 'Positive');
    result(['a', 'b', 'c'].contains('d', 'c'), false, 'Negative');
    result(['1', 2, 3].contains(1), false, 'Casting false-positive');
  },
  
  function Shuffle(result) {
    
    result(['a', 'b', 'c'].shuffle().join(',') != 'a,b,c', true, 'Ensure shuffle');
    result(['a', 'b', 'c'].shuffle().contains('a', 'b', 'd'), true, 'Element preservation');
  }

];