
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
  
  function Remove(result) {
    
    result(['a', 'b'].remove('b').join(','), 'a', 'Normal');
    result(['a', 'b'].remove('c').join(','), 'a,b', 'Out-of-range Normal');
  },
  
  function Shuffle(result) {
    
    result(['a', 'b', 'c'].shuffle().contains('a', 'b', 'd'), true, 'Element preservation');
  },
  
  function Clone(result) {
    
    var a = ['a', 'b'], b = a.clone();
        
    result(b.push('c') && a.contains('c'), false, 'Normal');
    result(b == a, false, 'Test Equality');
  },
  
  function Intersect(result) {
    
    var a = ['a', 'b', 'c'], b = ['b', 'c', 'd'], c = ['c', 'd', 'e'];
    
    result(a.intersect(b).join(','), 'b,c', 'Two-param Normal');
    result(a.intersect(b, c).join(','), 'c', 'Three-param Normal');
    result([1, '2', '3'].intersect(['1', 2, 3]).join(',') == '', true, 'Case-insentive empty intersection');
  },
  
  function Diff(result) {
    
    var a = ['a', 'b', 'c'], b = ['b', 'c', 'd'], c = ['c', 'd', 'e'];
    
    result(a.diff(b).join(','), 'd,a', 'Two-param Diff');
    result(a.diff(b, c).join(','), 'e,a', 'Three-param Diff');
    result([1, '2', '3'].diff(['1', 2, 3]).join(','), '1,2,3,1,2,3', 'Case-insentive diff');
  }

];