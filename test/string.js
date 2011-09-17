require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'String.UUID': function() {
    assert.strictEqual(String.UUID().length, 36);
    assert.notEqual(String.UUID(), String.UUID());
  },
  
  'String#chars': function() {
    assert.eql('abcd'.chars(), ['a','b','c','d']);
  },
  
  'String#count': function() {
    assert.strictEqual('abAb'.count('ab'), 2);
    assert.strictEqual('abAb'.count('ab', 'g'), 1);
  },
  
  'String#insert': function() {
    assert.strictEqual('ab'.insert('ab'), 'abab');
    assert.strictEqual('ab'.insert('ab', 1), 'aabb');
  },
  
  'String#reverse': function() {
    assert.strictEqual('abc'.reverse(), 'cba');
  },
  
  'String#ucfirst': function() {
    assert.strictEqual('abc'.ucfirst(), 'Abc');
  },
  
  'String#rpad': function() {
    assert.strictEqual('a'.rpad(4, '-'), 'a---');
    assert.strictEqual('a'.rpad(4), 'a   ');
    assert.strictEqual('a'.rpad(4, 'abcd'), 'aabc', false);
  },
  
  'String#lpad': function() {
    assert.strictEqual('a'.lpad(4, '-'), '---a');
    assert.strictEqual('a'.lpad(4), '   a');
    assert.strictEqual('a'.lpad(4, 'abcd'), 'cbaa', false);
  },
  
  'String#pad': function() {
    assert.strictEqual('a'.pad(4), 'a'.rpad(4));
    assert.strictEqual('a'.pad(-4), 'a'.lpad(4));
  },
  
  'String#swapCase': function() {
    assert.strictEqual('aBc'.swapcase(), 'AbC');
    assert.strictEqual('Δd'.swapcase(), 'δD');
  },
  
  'String#soundex': function() {
    assert.strictEqual('Hello'.soundex(), 'H040');
    assert.strictEqual('World'.soundex(), 'W0643');
  },
  
  'String#sprintf': function() {
    assert.strictEqual('abc'.sprintf(), 'abc');
    assert.strictEqual('%08b'.sprintf(511), '111111111');
    assert.strictEqual('%01.2f'.sprintf(12.1), '12.10');
    //TODO: More tests
  }
};