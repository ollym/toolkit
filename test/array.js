require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'Array.intersect': function() {
    assert.eql(Array.intersect([[1,2,3],[2,3,4],[3,4,5]]), [3]);
  },
  
  'Array.diff': function() {
    assert.eql(Array.diff([[1,2,3],[2,3,4],[3,4,5]]), [1,5]);
  },
  
  'Array.union': function() {
    assert.eql(Array.union([[1,2,3],[2,3,4],[3,4,5]]), [1,2,3,4,5]);
  },
  
  'Array.range': function() {
    var $R = Array.range;
    assert.eql($R(3), [1,2,3]);
    assert.eql($R(1,5,2), [1,3,5]);
  },
  
  'Array#swap': function() {
    assert.eql([1,2,3].swap(2, 0), [3,2,1]);
  },
  
  'Array#contains': function() {
    assert.ok([1,2,3].contains(1,2));
    assert.equal([1,2,3].contains(4), false);
  },
  
  'Array#remove': function() {
    var a = [1,2,3];
    assert.equal(a.remove(2,3), a);
    assert.eql(a, [1]);
  },
  
  'Array#shuffle': function() {
    var a = [1,2,3], b = a.shuffle();
    assert.notStrictEqual(b, a);
    assert.ok(a.contains(1,2,3));
    //TODO: Test shuffling mechanism
  },
  
  'Array#shuffle$': function() {
    var a = [1,2,3], b = a.shuffle$();
    assert.strictEqual(a, b);
    //TODO: Test shuffling mechanism
  },
  
  'Array#clone': function() {
    var a = [1,2,3], b = a.clone();
    assert.notStrictEqual(a, b);
    assert.eql(a, b)
  },
  
  'Array#intersect': function() {
    var a = [1,2,3], b = [2,3,4], c = [3,4,5]
    assert.eql(a.intersect(b,c), [3]);
  },
  
  'Array#diff': function() {
    var a = [1,2,3], b = [2,3,4], c = [3,4,5]
    assert.eql(a.diff(b,c), [5,1]);
  },
  
  'Array#chunk': function() {
    var $R = Array.range;
    assert.eql($R(12).chunk(3), [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]);
    assert.eql($R(12).chunk(7), [[1,2,3,4,5,6,7],[8,9,10,11,12]]);
    assert.eql($R(12).chunk(13), [[1,2,3,4,5,6,7,8,9,10,11,12]]);
  },
  
  'Array#chunk$': function() {
    var $R = Array.range, a = $R(12);
    assert.strictEqual(a.chunk$(3), a);
    assert.eql(a, [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]);
  },
  
  'Array#unique': function() {
    assert.eql([1,2,2].unique(), [1,2]);
  },
  
  'Array#forEach': function() {
    var j = 0, r = [1,2,3].each(function(i) {
      j = i; if (i == 2) return 3;
    });
    
    assert.strictEqual(j,2);
    assert.strictEqual(r,3);
  },
  
  'Array#flatten': function() {
    assert.eql([1,2,[[3]]].flatten(), [1,2,3]);
    assert.eql([1,2,[[3]]].flatten(1), [1,2,[3]]);
  },
  
  'Array#flatten$': function() {
    var a = [1,2,[[3]]];
    assert.strictEqual(a.flatten$(1), a);
    assert.eql(a, [1,2,[3]]);
  },
  
  'Array#sum': function() {
    assert.strictEqual([3,4,5].sum(), 12);
    assert.strictEqual([3,'4',5].sum(), 12);
  },
  
  'Array#product': function() {
    assert.strictEqual([3,4,5].product(), 60);
    assert.strictEqual([3,'4',5].product(), 60);
  },
  
  'Array#first': function() {
    assert.strictEqual([3,4,5].first(), 3);
    assert.eql([3,4,5].first(2), [3,4]);
  },
  
  'Array#last': function() {
    assert.strictEqual([3,4,5].last(), 5);
    assert.eql([3,4,5].last(2), [4,5]);
  },
  
  'Array#clean': function() {
    assert.eql([undefined,null,false,0,NaN,1,2].clean(), [1,2]);
  },
  
  'Array#clean$': function() {
    var a = [undefined,null,false,0,NaN,1,2];
    assert.strictEqual(a.clean$(), a);
    assert.eql(a, [1,2]);
  },
  
  'Array#filter$': function() {
    var a = [1,2,3,4,5,6];
    assert.strictEqual(a.filter$(function(a) { return a.even }), a);
    assert.eql(a, [2,4,6]);
  },
  
  'Array#map$': function() {
    var a = [1,2,3,4,5,6];
    assert.strictEqual(a.map$(function(a) { return a * a }), a);
    assert.eql(a, [1,4,9,16,25,36]);
  },
  
  'Array#map$': function() {
    var a = [1,2,3,4,5,6];
    assert.strictEqual(a.map$(function(a) { return a * a }), a);
    assert.eql(a, [1,4,9,16,25,36]);
  },
  
  'Array#union': function() {
    var a = [1,2,3], b = [3,4,5], c = [5,6,7];
    assert.eql(a.union(b,c), [3,4,5,6,7,1,2]);
  },
  
  'Array#invoke': function() {
    assert.eql([1.142,2.321,3.754].invoke('round', 2), [1.14,2.32,3.75]);
  },
  
  'Array#invoke$': function() {
    var a = [1.142,2.321,3.754];
    assert.strictEqual(a.invoke$('round', 2), a);
    assert.eql(a, [1.14,2.32,3.75]);
  },
  
  'Array#pluck': function() {
    assert.eql(['a','aa','aaa'].pluck('length'), [1,2,3]);
  },
  
  'Array#pluck$': function() {
    var a = ['a','aa','aaa'];
    assert.strictEqual(a.pluck$('length'), a);
    assert.eql(a, [1,2,3]);
  },
  
  'Array#grep': function() {
    assert.eql(['a','aa','abc'].grep(/(.)\1/), ['aa']);
  },
  
  'Array#grep$': function() {
    var a = ['a','aa','abc'];
    assert.strictEqual(a.grep$(/(.)\1/), a);
    assert.eql(a, ['aa']);
  },
  
  'Array#sort$': function() {
    var a = [3,1,4,6];
    assert.strictEqual(a.sort$(), a);
    assert.eql(a, [1,3,4,6]);
  },
  
  'Array#sortBy': function() {
    assert.eql([3,1,2].sortBy(), [1,2,3]);
    assert.eql(['aaa','a','aa'].sortBy('length'), ['a','aa','aaa']);
    assert.eql(['aaa','a','aa'].sortBy(function(v) { return v.length }), ['a','aa','aaa']);
  },
  
  'Array#sortBy$': function() {
    var a = ['aaa','a','aa'];
    assert.strictEqual(a.sortBy$('length'), a);
    assert.eql(a, ['a','aa','aaa']);
  },
  
  'Array#fetch': function() {
    assert.eql([3,2,1,4,5].fetch([2,1,0,3,4]), [1,2,3,4,5]);
    assert.eql([3,2,1,4,5].fetch(2,1,0,3,4), [1,2,3,4,5]);
    assert.eql([1,2,3].fetch(function(n) { return n % 3 }), [3,1,2]);
  },
}