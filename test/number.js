require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'Number#gcd': function() {
    assert.strictEqual((12).gcd(6,9), 3);
  },
  
  'Number#lcm': function() {
    assert.strictEqual((21).lcm(6), 42);
  },
  
  'Number#round': function() {
    assert.strictEqual((1.5).round(), 2);
    assert.strictEqual((1.52).round(1), 1.5);
    assert.strictEqual((15).round(-1), 20);
  },
  
  'Number#chr': function() {
    assert.strictEqual((72).chr, 'H');
  },
  
  'Number#even': function() {
    assert.strictEqual((3).even, false);
    assert.strictEqual((2).even, true);
  },
  
  'Number#odd': function() {
    assert.strictEqual((1).odd, true);
    assert.strictEqual((3).odd, true);
    assert.strictEqual((4).odd, false);
  },
  
  'Number#radix': function() {
    assert.strictEqual((127).radix(8, 5), '00177');
  },
  
  'Number#bin': function() {
    assert.strictEqual((15).bin(8), '00001111');
  },
  
  'Number#oct': function() {
    assert.strictEqual((127).oct(4), '0177');
  },
  
  'Number#dec': function() {
    assert.strictEqual((80).dec(4), '0080');
  },
  
  'Number#hexl': function() {
    assert.strictEqual((1023).hexl(), '3ff');
  },
  
  'Number#hex': function() {
    assert.strictEqual((1023).hex(), '3FF');
  },
  
  'Number#abbr': function() {
    assert.strictEqual((1023).abbr(), '1k');
    assert.strictEqual((999).abbr(), '999');
    assert.strictEqual((1e26).abbr(), '100Y');
    assert.strictEqual((1050).abbr(3), '1.050k');
    assert.strictEqual((1024).abbr(3,true), '1.000k');
  }
};