require('toolkit.js');

var assert = require('assert');

module.exports = {
  
  'Math.random': function() {
    
    var r = Math.random;
    
    assert.ok(r(1) >= 1);
    assert.ok(r(1) <= 2);
    assert.ok(r() >= 0);
    assert.ok(r() <= 1);
    assert.ok(r(100, 1000) >= 100);
    assert.ok(r(100, 1000) <= 1000);
  }
};