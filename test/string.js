module('String');

test('String.UUID', function() {
  strictEqual(String.UUID().length, 36);
  notEqual(String.UUID(), String.UUID());
});

test('String#eval', function() {
  strictEqual(''.eval.name, 'eval');
  strictEqual('3'.eval(), 3);
});
  
test('String#chars', function() {
  deepEqual('abcd'.chars(), ['a','b','c','d']);
});
  
test('String#count', function() {
  strictEqual('abAb'.count('ab'), 2);
  strictEqual('abAb'.count('ab', 'g'), 1);
});
  
test('String#insert', function() {
  strictEqual('ab'.insert('ab'), 'abab');
  strictEqual('ab'.insert('ab', 1), 'aabb');
});
  
test('String#reverse', function() {
  strictEqual('abc'.reverse(), 'cba');
});
  
test('String#ucfirst', function() {
  strictEqual('abc'.ucfirst(), 'Abc');
});
  
test('String#rpad', function() {
  strictEqual('a'.rpad(4, '-'), 'a---');
  strictEqual('a'.rpad(4), 'a   ');
  strictEqual('a'.rpad(4, 'abcd'), 'aabc', false);
});
  
test('String#lpad', function() {
  strictEqual('a'.lpad(4, '-'), '---a');
  strictEqual('a'.lpad(4), '   a');
  strictEqual('a'.lpad(4, 'abcd'), 'cbaa', false);
});
  
test('String#pad', function() {
  strictEqual('a'.pad(4), 'a'.rpad(4));
  strictEqual('a'.pad(-4), 'a'.lpad(4));
});
  
test('String#swapCase', function() {
  strictEqual('aBc'.swapcase(), 'AbC');
});
  
test('String#soundex', function() {
  strictEqual('Hello'.soundex(), 'H040');
  strictEqual('World'.soundex(), 'W0643');
});
  
test('String#sprintf', function() {
  strictEqual('abc'.sprintf(), 'abc');
  strictEqual('%08b'.sprintf(511), '111111111');
  strictEqual('%01.2f'.sprintf(12.1), '12.10');
  //TODO: More tests
});

test('String#btoa', function() {
  strictEqual('Hello World'.btoa(), 'SGVsbG8gV29ybGQ=');
});

test('String#atob', function() {
  strictEqual('SGVsbG8gV29ybGQ='.atob(), 'Hello World');
});