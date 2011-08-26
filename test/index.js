
require('../lib')

var modules = ['Object', 'Array', 'Math'];

modules.forEach(function(mod) {
  require('./test.' + mod).forEach(function(test) {
    test(function(actual, expected, msg) {
      if (actual != expected) {
        console.error('Failure in test: ' + mod + '.' + test.name + '. Case "' + msg + '"\n\t' + 'Expected: "' + expected + '" Actual: "' + actual + '"');
      }
    });
  });
});