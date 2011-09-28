module('Date');

test('Date#fuzzyDiff', function() {
  strictEqual(Date.prototype.fuzzyDiff.name, 'fuzzyDiff');
  strictEqual((new Date()).fuzzyDiff(Date.now() - 5000), 'exactly 5 seconds ago');
  strictEqual((new Date()).fuzzyDiff(Date.now() - 5123), 'about 5 seconds ago');
});