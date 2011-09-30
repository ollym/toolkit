module('Date');

test('Date#fuzzyDiff', function () {
  strictEqual((new Date()).fuzzyDiff(Date.now() - 5000), 'exactly 5 seconds ago');
  strictEqual((new Date()).fuzzyDiff(Date.now() - 5123), 'about 5 seconds ago');
  //strictEqual((new Date('2011-09-09')).fuzzyDiff('2011-09-07'), 'exactly 2 days ago');
});