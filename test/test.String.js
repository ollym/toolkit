
module.exports = [
  
  function Chars(result) {
    result('abcd'.chars(), 'a,b,c,d', 'Normal');
  },

  function Count(result) {
    result('abAb'.count('ab'), 2, 'Normal');
    result('abAb'.count('ab', 'g'), 1, 'Case-sensitive modifier.');
  },
  
  function Insert(result) {
    result('ab'.insert('ab'), 'abab', 'Normal');
    result('ab'.insert('ab', 1), 'aabb', 'Index-1');
  },
  
  function Reverse(result) {
    result('abc'.reverse(), 'cba', 'Normal');
  },
  
  function Ucfirst(result) {
    result('abc'.ucfirst(), 'Abc', 'Normal');
  },
  
  function Rpad(result) {
    
    var str = 'a';
    
    result(str.rpad(4, '-'), 'a---', 'Normal');
    result(str.rpad(4), 'a   ', 'Default char');
    result(str.rpad(4, 'abcd'), 'aabc', 'Cut pad');
  },
  
  function Lpad(result) {
    
    var str = 'a';
    
    result(str.lpad(4, '-'), '---a', 'Normal');
    result(str.lpad(4), '   a', 'Default char');
    result(str.lpad(4, 'abcd'), 'cbaa', 'Cut pad');
  },
  
  function SwapCase(result) {
    result('aBc'.swapcase(), 'AbC', 'Normal');
    result('Δd'.swapcase(), 'δD', 'Unicode Chars');
  },
  
  function Soundex(result) {
    
    result('Hello'.soundex(), 'H040', 'Normal');
    result('World'.soundex(), 'W064', 'Normal');
  },
  
  function Distance(result) {
    
    result('Hello'.distance('World'), 4, 'Normal');
    result('foobar'.distance('foobaz'), 1, 'Normal');
  }

];