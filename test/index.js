
require('../lib')

var modules = ['Object', 'Array', 'Math'];
var start = Date.now();

modules.forEach(function(mod) {
  require('./test.' + mod).forEach(function(test) {
    test(function(actual, expected, msg) {
      if (actual != expected) {
        console.error('\nFailure: ' + mod + '.' + test.name + '. Case "' + msg + '"\n\t' + 'Expected: "' + expected + '" Actual: "' + actual + '"');
      }
    });
  });
});

console.log('\nTests completed in: ' + (Date.now() - start) + 'ms');