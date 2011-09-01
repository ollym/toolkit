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
    result(['a', 'b', 'c'].shuffle().contains('a', 'b', 'c'), true, 'Element preservation');
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
  },
  
  function Chunk(result) {
    
    result(Array.range(12).chunk(4).join(':'), '1,2,3,4:5,6,7,8:9,10,11,12', 'Even split');
    result(Array.range(12).chunk(7).join(':'), '1,2,3,4,5,6,7:8,9,10,11,12', 'Odd split');
    result(Array.range(12).chunk(13).join(':'), '1,2,3,4,5,6,7,8,9,10,11,12', 'No split');
  },
  
  function Unique(result) {
    
    result(['a', 'a', 'b'].unique(), 'a,b', 'Normal');
    result(['a', 'b', 'c'].unique(), 'a,b,c', 'No Change');
  },
  
  function Each(result) {
    
    var j = 0;
    var ret = [1, 2, 3].each(function(i) {
      j = i;
      if (i == 2) return 'foo';
    });
    
    result(ret == 'foo', true, 'Return value');
    result(j == 2, true, 'Stop looping');
  },
  
  function Flatten(result) {
    
    result(JSON.stringify([1,2,[[3]]].flatten()), '[1,2,3]', 'Normal');
    result(JSON.stringify([1,2,[[3]]].flatten(1)), '[1,2,[3]]', 'Level-1');
    result(JSON.stringify([1,[2],[[[3]]]].flatten(2)), '[1,2,[3]]', 'Level-2');
  },
  
  function Sum(result) {
    
    result([1, 2, 3].sum(), 6, 'Normal');
  },
  
  function Product(result) {
    
    result([2, 3, 5].product(), 30, 'Normal');
  },
  
  function First(result) {
    
    result([2, 3, 5].first(), 2, 'Normal');
    result([2, 3, 5].first(2), '2,3', 'N-2');
  },
  
  function Last(result) {
    
    result([2, 3, 5].last(), 5, 'Normal');
    result([2, 3, 5].last(2), '3,5', 'N-2');
  },
  
  function Clean(result) {
    
    result([undefined, null, false, 0, NaN, 'foo', 'bar'].clean(), 'foo,bar', 'Normal');
  }
];