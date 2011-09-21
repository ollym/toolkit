module('Array');
  
test('Array.intersect', function() {
  deepEqual(Array.intersect([[1,2,3],[2,3,4],[3,4,5]]), [3]);
});
  
test('Array.diff', function() {
  deepEqual(Array.diff([[1,2,3],[2,3,4],[3,4,5]]), [1,5]);
});
  
test('Array.union', function() {
  deepEqual(Array.union([[1,2,3],[2,3,4],[3,4,5]]), [1,2,3,4,5]);
});
  
test('Array.range', function() {
  var $R = Array.range;
  deepEqual($R(3), [1,2,3]);
  deepEqual($R(1,5,2), [1,3,5]);
});

test('Array#concat$', function() {
  var arr = [1,2,3];
  strictEqual(arr.concat$([4,5,6]), arr);
  deepEqual(arr, [1,2,3,4,5,6]);
});
  
test('Array#swap', function() {
  deepEqual([1,2,3].swap(2, 0), [3,2,1]);
});
  
test('Array#contains', function() {
  ok([1,2,3].contains(1,2));
  equal([1,2,3].contains(4), false);
});
  
test('Array#remove', function() {
  var a = [1,2,3];
  equal(a.remove(2,3), a);
  deepEqual(a, [1]);
});
  
test('Array#shuffle', function() {
  var a = [1,2,3], b = a.shuffle();
  notStrictEqual(b, a);
  ok(a.contains(1,2,3));
  //TODO: Test shuffling mechanism
});
  
test('Array#shuffle$', function() {
  var a = [1,2,3], b = a.shuffle$();
  strictEqual(a, b);
  //TODO: Test shuffling mechanism
});
  
test('Array#clone', function() {
  var a = [1,2,3], b = a.clone();
  notStrictEqual(a, b);
  deepEqual(a, b)
});
  
test('Array#intersect', function() {
  var a = [1,2,3], b = [2,3,4], c = [3,4,5]
  deepEqual(a.intersect(b,c), [3]);
});
  
test('Array#diff', function() {
  var a = [1,2,3], b = [2,3,4], c = [3,4,5]
  deepEqual(a.diff(b,c), [5,1]);
});
  
test('Array#chunk', function() {
  var $R = Array.range;
  deepEqual($R(12).chunk(3), [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]);
  deepEqual($R(12).chunk(7), [[1,2,3,4,5,6,7],[8,9,10,11,12]]);
  deepEqual($R(12).chunk(13), [[1,2,3,4,5,6,7,8,9,10,11,12]]);
});
  
test('Array#chunk$', function() {
  var $R = Array.range, a = $R(12);
  strictEqual(a.chunk$(3), a);
  deepEqual(a, [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]);
});
  
test('Array#unique', function() {
  deepEqual([1,2,2].unique(), [1,2]);
});
  
test('Array#forEach', function() {
  var j = 0, r = [1,2,3].each(function(i) {
    j = i; if (i == 2) return 3;
  });
  
  strictEqual(j,2);
  strictEqual(r,3);
});
  
test('Array#flatten', function() {
  deepEqual([1,2,[[3]]].flatten(), [1,2,3]);
  deepEqual([1,2,[[3]]].flatten(1), [1,2,[3]]);
});
  
test('Array#flatten$', function() {
  var a = [1,2,[[3]]];
  strictEqual(a.flatten$(1), a);
  deepEqual(a, [1,2,[3]]);
});
  
test('Array#sum', function() {
  strictEqual([3,4,5].sum(), 12);
  strictEqual([3,'4',5].sum(), 12);
});
  
test('Array#product', function() {
  strictEqual([3,4,5].product(), 60);
  strictEqual([3,'4',5].product(), 60);
});
  
test('Array#first', function() {
  strictEqual([3,4,5].first(), 3);
  deepEqual([3,4,5].first(2), [3,4]);
});
  
test('Array#last', function() {
  strictEqual([3,4,5].last(), 5);
  deepEqual([3,4,5].last(2), [4,5]);
});
  
test('Array#clean', function() {
  deepEqual([undefined,null,false,0,NaN,1,2].clean(), [1,2]);
});
  
test('Array#clean$', function() {
  var a = [undefined,null,false,0,NaN,1,2];
  strictEqual(a.clean$(), a);
  deepEqual(a, [1,2]);
});
  
test('Array#filter$', function() {
  var a = [1,2,3,4,5,6];
  strictEqual(a.filter$(function(a) { return a.even() }), a);
  deepEqual(a, [2,4,6]);
});
  
test('Array#map$', function() {
  var a = [1,2,3,4,5,6];
  strictEqual(a.map$(function(a) { return a * a }), a);
  deepEqual(a, [1,4,9,16,25,36]);
});
  
test('Array#map$', function() {
  var a = [1,2,3,4,5,6];
  strictEqual(a.map$(function(a) { return a * a }), a);
  deepEqual(a, [1,4,9,16,25,36]);
});
  
test('Array#union', function() {
  var a = [1,2,3], b = [3,4,5], c = [5,6,7];
  deepEqual(a.union(b,c), [3,4,5,6,7,1,2]);
});
  
test('Array#invoke', function() {
  deepEqual([1.142,2.321,3.754].invoke('round', 2), [1.14,2.32,3.75]);
});
  
test('Array#invoke$', function() {
  var a = [1.142,2.321,3.754];
  strictEqual(a.invoke$('round', 2), a);
  deepEqual(a, [1.14,2.32,3.75]);
});
  
test('Array#pluck', function() {
  
  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' };

  var arr = [a,b,c].pluck(['name','age']);
  
  deepEqual(arr, [{name:'Ann',age:36},{name:'Bob',age:21},{name:'Charlie',age:31}]);
  deepEqual(['a','aa','aaa'].pluck('length'), [1,2,3]);
});
  
test('Array#pluck$', function() {
  
  var a = ['a','aa','aaa'];
  
  strictEqual(a.pluck$('length'), a);
  deepEqual(a, [1,2,3]);
  
  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' }
  
  var arr = [a,b,c];

  strictEqual(arr.pluck$(['name', 'age']), arr);
  deepEqual(arr, [{name:'Ann',age:36},{name:'Bob',age:21},{name:'Charlie',age:31}]);
});
  
test('Array#grep', function() {
  deepEqual(['a','aa','abc'].grep(/(.)\1/), ['aa']);
});
  
test('Array#grep$', function() {
  var a = ['a','aa','abc'];
  strictEqual(a.grep$(/(.)\1/), a);
  deepEqual(a, ['aa']);
});
  
test('Array#sort$', function() {
  var a = [3,1,4,6];
  strictEqual(a.sort$(), a);
  deepEqual(a, [1,3,4,6]);
});
  
test('Array#sortBy', function() {
  deepEqual([3,1,2].sortBy(), [1,2,3]);
  deepEqual(['aaa','a','aa'].sortBy('length'), ['a','aa','aaa']);
  deepEqual(['aaa','a','aa'].sortBy(function(v) { return v.length }), ['a','aa','aaa']);
});
  
test('Array#sortBy$', function() {
  var a = ['aaa','a','aa'];
  strictEqual(a.sortBy$('length'), a);
  deepEqual(a, ['a','aa','aaa']);
});
  
test('Array#fetch', function() {
  deepEqual([3,2,1,4,5].fetch([2,1,0,3,4]), [1,2,3,4,5]);
  deepEqual([3,2,1,4,5].fetch(2,1,0,3,4), [1,2,3,4,5]);
  deepEqual([1,2,3].fetch(function(n) { return n % 3 }), [3,1,2]);
});

/* ECMA5 Polyfil Tests */