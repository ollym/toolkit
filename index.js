var domDefineProperty = false;

// Whether we have a working version of Object.defineProperty
try { Object.defineProperty({}, 'x', {});
} catch(e) { domDefineProperty=true; }

var hide = function(prototype, properties) {
  return;
  if (domDefineProperty) {
        
    if ( ! ('__ownPropertyDescriptors__' in prototype))
      prototype['__ownPropertyDescriptors__'] = {};
    
    for (var i = 0; i < properties.length; i++)
      if ( ! (properties[i] in prototype['__ownPropertyDescriptors__']))
        prototype['__ownPropertyDescriptors__'][properties[i]] = { writable: true, enumerable: false, configurable: true }
        
  }
}

var extend = function(prototype, methods) {
  
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
    if (name == 'propertyIsEnumerable') alert('ho');
    var method = methods[name];
        
    if (domDefineProperty) {
      /*
      if ( ! ('__ownPropertyDescriptors__' in prototype))
        prototype['__ownPropertyDescriptors__'] = {};
                
      prototype['__ownPropertyDescriptors__'][name] = { writable: true, enumerable: false, configurable: true }
      */
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

window.extend = extend;
