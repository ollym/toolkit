var domDefineProperty = false, objectIdStore = [], objectDescriptorStore = [];

// Whether we have a working version of Object.defineProperty
try { Object.defineProperty({}, 'x', {});
} catch(e) { domDefineProperty=true; }

if (window && window.__jstExtend__) {
  var extend = window.__jstExtend__;
}
else var extend = function(prototype, methods) {
  
  var title = null;
  
  switch (prototype) {
    case Array:               { title = 'Array.';    break; }
    case Array.prototype:     { title = 'Array#';    break; }
    case Function:            { title = 'Function.'; break; }
    case Function.prototype:  { title = 'Function#'; break; }
    case Number:              { title = 'Number.';   break; }
    case Number.prototype:    { title = 'Number#';   break; }
    case Object:              { title = 'Object.';   break; }
    case Object.prototype:    { title = 'Object#';   break; }
    case String:              { title = 'String.';   break; }
    case String.prototype:    { title = 'String#';   break; }
    case Math:                { title = 'Math.';     break; }
    case Date:                { title = 'Date.';     break; }
    case Date.prototype:      { title = 'Date#';     break; }
    default: {
      throw new Error('Override detector found an unknown prototype being extended.');
    }
  }
  
  if (typeof methods === 'string') {
    var n = methods, methods = {};
    methods[n] = arguments[2];
  }
  
  for (name in methods) {
    var method = methods[name];
        
    if (domDefineProperty) {
      
      var id = -1;
      for (var i = 0; i < objectIdStore.length; i++)  
        if (objectIdStore[i] === prototype)
          id = i;
      id = id < 0 ? objectIdStore.push(prototype) - 1 : id;
      
      if ( ! objectDescriptorStore[id])
        objectDescriptorStore[id] = {};
      
      objectDescriptorStore[id][name] = { writable: true, enumerable: false, configurable: true };
      prototype[name] = method;

    } 
    else {
      Object.defineProperty(prototype, name, {
        value: method,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
}

if (this.module && module.exports) {
  module.exports.repl = function() {
    var vm = require('vm'), repl = require('repl');
    process.stdin.removeAllListeners('keypress');
    var ctx = repl.start('toolkit> ').context;
    ctx.Array = Array;
    ctx.Object = Object;
    ctx.Number = Number;
    ctx.Date = Date;
    ctx.RegExp = RegExp;
    ctx.String = String;
    ctx.Function = Function; 
  }
}