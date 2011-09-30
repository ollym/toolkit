/** Globals available throughout jst.js **/
var domDefineProperty = false, objectIdStore = [], objectDescriptorStore = [];
var extend, alias;

// Trap ie8 and non-ecma5 platforms.
try {
  Object.defineProperty({}, 'x', {});
} catch (e) {
  domDefineProperty = true;
}

// Allow people to alter the way jst extends methods
if (typeof window !== 'undefined' && window.__jstExtend)
  extend = window.__jstExtend;
else {
  extend = function (prototype, methods) {
      
    // Only 1 property being extended(prototype, name, value)
    if (arguments.length === 3) {
      var n = methods, methods = {};
      methods[n] = arguments[2];
    }
    
    // Loop through each method
    for (name in methods) {
      if (Object.prototype.hasOwnProperty.call(methods, name)) {
        var method = methods[name];
        
        // We're going to have store descriptors
        if (domDefineProperty) {
          
          // Get an id for the the object by use of the objectIdStore
          for (var id = -1, i = 0; i < objectIdStore.length; i++)
            if (objectIdStore[i] === prototype)
              id = i;
              
          id = (id < 0) ? objectIdStore.push(prototype) -1 : id;
          
          if ( ! objectDescriptorStore[id])
            objectDescriptorStore[id] = {};
          
          objectDescriptorStore[id][name] = 
            { writable: (typeof method === 'function'), enumerable: false, configurable: (typeof method === 'function') };
            
          prototype[name] = method;
        }
        else {
          Object.defineProperty(prototype, name, {
            value: method, writable: (typeof method === 'function'), enumerable: false, configurable: (typeof method === 'function')
          });
        }
      }
    }
  }
}