module('RegExp');

test('RegExp.escape', function() {
  strictEqual(RegExp.escape.name, 'escape');
  strictEqual(RegExp.escape('U$es |()ts +f r*ser^ed keyw()rds.'), 'U\\$es \\|\\(\\)ts \\+f r\\*ser\\^ed keyw\\(\\)rds\\.');
});