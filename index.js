var defineProperties = Object.defineProperties;
Object.defineProperties = function(prototype, descriptors) {
  Object.keys(descriptors).forEach(function(name) {
    if (prototype[name] !== undefined) {
      switch (prototype) {
        case Array:               { name = 'Array.' + name;    break; }
        case Array.prototype:     { name = 'Array#' + name;    break; }
        case Function:            { name = 'Function.' + name; break; }
        case Function.prototype:  { name = 'Function#' + name; break; }
        case Number:              { name = 'Number.' + name;   break; }
        case Number.prototype:    { name = 'Number#' + name;   break; }
        case Object:              { name = 'Object.' + name;   break; }
        case Object.prototype:    { name = 'Object#' + name;   break; }
        case String:              { name = 'String.' + name;   break; }
        case String.prototype:    { name = 'String#' + name;   break; }
        case Math:                { name = 'Math.' + name;     break; }
        case Date:                { name = 'Date.' + name;     break; }
        case Date.prototype:      { name = 'Date#' + name;     break; }
        default: {
          throw new Error('Override detector found an unknown prototype being extended.');
        }
      }
      
      console.warn('JSToolkit is attempting to override. An existing method ' + name + '. It has therefore been excluded. If you want to use this method instead delete it first.');
    }
    else {
      Object.defineProperty(prototype, name, descriptors[name]);
    }
  });
}

require('./object');
require('./array');
require('./number');
require('./string');
require('./function');

Object.defineProperties = defineProperties;