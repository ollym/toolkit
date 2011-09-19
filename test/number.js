module('Number');
  
test('Number.random', function() {
  
  var r = Number.random;
  
  ok(r(1) >= 1);
  ok(r(1) <= 2);
  ok(r() >= 0);
  ok(r() <= 1);
  ok(r(100, 1000) >= 100);
  ok(r(100, 1000) <= 1000);
});
  
test('Number#gcd', function() {
  strictEqual((12).gcd(6,9), 3);
});
  
test('Number#lcm', function() {
  strictEqual((21).lcm(6), 42);
});
  
test('Number#round', function() {
  strictEqual((1.5).round(), 2);
  strictEqual((1.52).round(1), 1.5);
  strictEqual((15).round(-1), 20);
});
  
test('Number#chr', function() {
  strictEqual((72).chr(), 'H');
});
  
test('Number#even', function() {
  strictEqual((3).even(), false);
  strictEqual((2).even(), true);
});
  
test('Number#odd', function() {
  strictEqual((1).odd(), true);
  strictEqual((3).odd(), true);
  strictEqual((4).odd(), false);
});
  
test('Number#radix', function() {
  strictEqual((127).radix(8, 5), '00177');
});
  
test('Number#bin', function() {
  strictEqual((15).bin(8), '00001111');
});
  
test('Number#oct', function() {
  strictEqual((127).oct(4), '0177');
});
  
test('Number#dec', function() {
  strictEqual((80).dec(4), '0080');
});
  
test('Number#hexl', function() {
  strictEqual((1023).hexl(), '3ff');
});
  
test('Number#hex', function() {
  strictEqual((1023).hex(), '3FF');
});
  
test('Number#abbr', function() {
  strictEqual((1023).abbr(), '1k');
  strictEqual((999).abbr(), '999');
  strictEqual((1e26).abbr(), '100Y');
  strictEqual((1050).abbr(3), '1.050k');
  strictEqual((1024).abbr(3,true), '1.000k');
});