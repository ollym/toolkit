if (typeof module !== 'undefined' && module.exports) {
  module.exports.repl = function () {
    var vm = require('vm'), repl = require('repl');
    process.stdin.removeAllListeners('keypress');
    var ctx = repl.start('toolkit> ').context;
    ctx.Array = Array; ctx.Object = Object; ctx.Number = Number; ctx.Date = Date;
    ctx.RegExp = RegExp; ctx.String = String; ctx.Function = Function; 
  }
}