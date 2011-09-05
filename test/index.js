
require('../index')

var modules = ['Object', 'Array', 'Math', 'Number', 'String', 'Function'];
var start = Date.now();
var failures = 0;

modules.forEach(function(mod) {
  
  require('./test.' + mod).forEach(function(test) {
        
    test(function(actual, expected, msg) {  
      if (actual != expected) {
        failures++;
        console.error('\nFailure: ' + mod + '.' + test.name + '. Case "' + msg + '"\n\t' + 'Expected: "' + expected + '" Actual: "' + actual + '"');
      }
    });
  });
});

var elapsed = (Date.now() - start);

if (failures == 0) {
  console.log('\nAll Tests Passed!');
}
else {
  console.log('\n' + failures + ' failures :(');
}

console.log('Tests completed in: ' + elapsed + 'ms');