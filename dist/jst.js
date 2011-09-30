(function () {/** Globals available throughout jst.js **/
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
}extend(Array, {
  
  range: function range(start, stop, step) {
    /**
     * Constructs an array containing a number of integers specified by the parameters. A RangeError will be raised if you attempt an infinite loop.
     * 
     * @since 1.0.0
     * @param [start=1] The number to start at
     * @param stop The number to stop at
     * @param [step=1] How many to increment at a time
     * @example
     *  Array.range(5, 12, 2)
     *    // returns [5,7,9,11]
     *
     *  Array.range(5, 8)
     *    // returns [5,6,7,8]
     *
     *  Array.range(5)
     *    // returns [1,2,3,4,5]
     *
     *  Array.range(-3)
     *    // returns [-1,-2,-3]
     * 
     * @returns array
     */
    if (arguments.length === 1) { stop = start; step = start = (stop < 0 ? -1 : 1); }
    else if (arguments.length === 0) return [];
    else if (step === undefined) step = (stop < start ? -1 : 1);
    else if (step === 0 || isNaN(step)) throw new RangeError('Step must be an valid integer and not be equal to 0.');
    
    step = Number(step), stop = Number(stop), start = Number(start);    
    var arr = [];
    
    if (stop < start) {
      if (step >= 0) throw new RangeError('Stop must not be greater than start if step is to be positive.');
      for (var i = start, arr = []; i >= stop; arr.push(i), i += step);
    }
    
    if (stop > start) {
      if (step <= 0) throw new RangeError('Stop must not be less than start if step is to be negative.');
      for (var i = start, arr = []; i <= stop; arr.push(i), i += step);
    }

    return arr;
  }
});

extend(Array.prototype, {
  
  concat$: function concat$() {
    /**
     * The self-modification version of concat. Merges a second array onto the end of the first.
     *
     * @since 1.5.0
     * @param *arrays The arrays to concat
     * @example
     *  var arr = [1,2,3];
     *  arr.concat$([4,5], [6,7]) === arr;
     *    // true
     *  arr;
     *    // arr = [1,2,3,4,5,6,7]
     * 
     * @returns self
     */
    var args = Array.prototype.slice.call(arguments).flatten(1);
    this.splice.apply(this, [this.length, 0].concat(args));
    
    return this;
  },
  
  swap: function swap(index1, index2) {
    /**
     * The self modification version of Array#Swap.
     *
     * @since 1.5.3
     * @param index1 The index of the first item to swap
     * @param index2 The index of the value to swap it with
     * @example
     *  [5, 10, 15].swap(0,2);
     *    // returns [15, 10, 5]
     * 
     * @returns array
     */
    return this.clone().swap$(index1, index2);
  },
  
  swap$: function swap$(index1, index2) {
    /**
     * The self modification version of Array#Swap.
     *
     * @since 1.5.3
     * @param index1 The index of the first item to swap
     * @param index2 The index of the value to swap it with
     * @example
     *  var arr = [5, 10, 15];
     *  arr.swap$(0,2) === arr; // true
     *  arr;
     *    // arr = [15, 10, 5]
     * 
     * @returns self
     */
    if ( ! Object.hasOwnProperty.call(this, Number(index1)))
      throw new RangeError('Array#swap: index1 does not exist within the array.')
      
    if ( ! Object.hasOwnProperty.call(this, Number(index2)))
      throw new RangeError('Array#swap: index2 does not exist within the array.')
      
    var value = this[index1];

    this[index1] = this[index2];
    this[index2] = value;
    
    return this;
  },
  
  contains: function contains(values) {
    /**
     * Checks whether the array obtains a certain value. This uses the internal indexOf() method which enforces strict equality (===).
     *
     * @since 1.0.0
     * @alias include,has
     * @param *values All the values
     * @example
     *  [1,2,3].contains(2);
     *    //returns true
     *
     *  [1,2,3].contains(3,4);
     *    //returns false
     * 
     * @returns bool
     */
    if (arguments.length === 0) return false;
    args = Array.prototype.slice.call(arguments);
    
    return args.every(function (arg) { 
      return !! ~ this.indexOf(arg);
    }.bind(this));
  },
  
  remove$: function remove$() {
    /**
     * Self modification of Array.remove. Removes given values from the array.
     *
     * @since 1.5.3
     * @param *values All the values
     * @example
     *  var arr = [5, 2, 5, 7];
     *  arr.remove$(5, 2) === arr; // true
     *  arr;
     *    // arr = [5,7]
     * 
     * @returns self
     */
    if (arguments.length === 0) return this;
    exclude = Array.prototype.slice.call(arguments);
    
    return this.filter$(function (val) {
      return ! exclude.contains(val);
    });
  },
  
  remove: function remove() {
    /**
     * Removes given values from a clone of the array and returns it.
     *
     * @since 1.5.3
     * @param *values All the values
     * @example
     *  [5, 2, 5, 7].remove(5, 2);
     *    // returns [5,7]
     * 
     * @returns array
     */
    if (arguments.length === 0) return this.clone();
    exclude = Array.prototype.slice.call(arguments);
    
    return this.filter(function (val) {
      return ! exclude.contains(val); 
    });
  },
  
  shuffle: function shuffle() {
    /**
     * Re-orders all values within the array into a random order.
     *
     * @since 1.0.0
     * @example
     *  ['a','b','c'].shuffle();
     *    // returns something like b,a,c
     *
     * @returns array
     */
    var arr = this.clone();

    for (var index = 0; index < arr.length - 1; index++) {
      arr.swap$(index, Number.random(index, arr.length - 1).round());
    }
        
    return arr;
  },
  
  shuffle$: function shuffle$() {
    /**
     * The self-modification variant of Array.shuffle.
     *
     * @since 1.3.0
     * @example
     *  var arr = ['a','b','c'];
     *  arr.shuffle$() === arr; // true
     *  arr;
     *    // arr will be something like b,a,c
     *
     * @returns self
     */
    for (var index = 0; index < this.length - 1; index++) {
      this.swap$(index, Number.random(index, this.length - 1).round());
    }
    
    return this;
  },
  
  clone: function clone() {
    /**
     * Clones all array values. This will remove any user-defined properties. If you don't want this use Object.clone() instead.
     *
     * @since 1.0.0
     * @example
     *  var a = [1,2,3], b = a.clone();
     *  a == b; // false
     *  a.join(',') == b.join(','); // true
     *
     * @returns array
     */
    return this.slice();
  },
  
  intersect: function intersect() {
    /**
     * Finds values that are contained within all given arrays. Non-arrays given as parameters will be ignored.
     *
     * @since 1.0.0
     * @alias intersection
     * @updated 1.6.0 Calling without parameters does the intersection on the array instance's values.
     * @param [*values] The arrays to intersect. If no values are given then the values are the sub arrays within this.
     * @example
     *  [1,2,3].intersect([2,3,4], [3,4,5]);
     *    // returns [3]
     *
     *  [[2,3,4],[1,2,3],[3,4,5]].intersect();
     *    // returns [3]
     *
     *  [1,2,3].intersect(2,[2,3]);
     *    // returns [2]
     *
     * @returns array
     */
    var arrays = (arguments.length === 0) ? this : [this].concat(Array.prototype.slice.call(arguments));

    if (arrays.length === 0) return [];
    else if (arrays.length === 1) return arrays[0];
    
    arrays.map$(function(v) {
      if ( ! Array.isArray(v)) return [v];
      else return v;
    });

    return arrays.first().filter(function (val) {
      return arrays.every(function (arr) {
        return arr.contains(val);
      });
    });
    
  },

  diff: function diff() {
    /**
     * Finds all values that are only contained in 1 of the supplied arrays. Non-array values will be conted as single values.
     *
     * @since 1.0.0
     * @alias difference
     * @updated 1.6.0
     *  Integrated Array.diff into this method if the user didn't supply any arguments.
     *
     * @param *arrays The arrays to differentiate with
     * @example
     *  [1,2,3].diff([2,3,4], [3,4,5]);
     *    // returns [1,5]
     *
     *  [[1,2,3], [2,3,4], [3,4,5]].diff();
     *    // returns [1,5]
     *
     *  // As of 1.5.3
     *  [1,2,3].diff(2,[3,4]);
     *    // returns [1,4]
     *
     * @returns array
     */
    var values = this.concat.apply(this, Array.prototype.slice.call(arguments)).flatten(1);
    
    if (values.length === 0) return [];
    else if (values.length === 1) return arrays[0];
    
    return values.filter(function (a,i,t) {
      return t.indexOf(a) === t.lastIndexOf(a);
    });
  },
  
  union: function union() {
    /**
     * Merges all the arrays and finds the unique values within it.
     *
     * @since 1.3.0
     * @param *arrays The arrays to union
     * @example
     *  [1,2,3].union([3,4,5], [5,6,7]);
     *    // returns [1,2,3,4,5,6,7]
     *
     *  [[1,2,3], [3,4,5], [5,6,7]].union();
     *    // returns [1,2,3,4,5,6,7]
     *
     *  [1,2,3].union(4,[5,6]);
     *    // returns [1,2,3,4,5,6,7]
     *
     * @returns array
     */
    var values = this.concat.apply(this, Array.prototype.slice.call(arguments)).flatten(1);
        
    if (values.length === 0) return [];
    else if (values.length === 1) return arrays[0];
    
    return values.flatten(1).unique();
  },
  
  chunk: function chunk(size) {
    /**
     * Takes an array and slices it into an array of smaller chunks. Very useful for dealing with groups of items at a time.
     *
     * @since 1.0.0
     * @param size The size of the array chunks
     * @example
     *  [1,2,3,4,5,6].chunk(2);
     *    // returns [[1,2],[3,4],[5,6]]
     *
     * @returns array
     */
    for (var arr = []; this.length > 0; arr.push(this.splice(0, size)));
    return arr;
  },
  
  chunk$: function chunk$(size) {
    /**
     * The self-modification version of Array.chunk.
     *
     * @since 1.3.0
     * @param size The size of the array chunks
     * @example
     *  var arr = [1,2,3,4,5,6]
     *  arr.chunk$(2) === arr;
     *  arr;
     *    // arr = [[1,2],[3,4],[5,6]]
     *
     * @returns self
     */
    for (var i = 0, length = this.length / size; i < length; i++) {
      this.splice(i, 0, this.splice(i, size));
    }
    
    return this;
  },
  
  unique: function unique() {
    /**
     * Clones the array and removes any duplicate values from it.
     *
     * @since 1.0.0
     * @example
     *  [1,2,2,3,4,3].unique()
     *    // returns [1,2,3,4]
     *
     * @returns array
     */
    return this.filter(function (a, idx) {
      return this.indexOf(a) == idx;
    }.bind(this));
  },
  
  each: function each(callback) {
    /**
     * Unlike forEach(), each() allows the loop to be broken and a value returned. The callback is called for each item and given (value, index, self) as its parameters. If it returns a value other than undefined the loop will be stopped and that value returned.
     *
     * @since 1.0.0
     * @param callback The function to call on each item
     * @param thisArg The value to assign to 'this' on the callback
     * @example
     *  [1,2,3,4,5,6].each(function (val, idx) {
     *    if (val == 2) return idx;
     *  });
     *  // returns 2
     *
     * @returns mixed
     */ 
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0, arr = [], result;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if ((i in self) && (result = callback.call(thisArg, self[i], i, self)) !== undefined)
        return result;
  },
  
  flatten: function flatten(level) {
    /**
     * Takes a multi-dimensional array and merges it upwards. Turning it into a single-dimension array. The level parameter specifies how many levels to go down within the array.
     *
     * @since 1.0.0
     * @param level How deep to go
     * @example
     *  [[1,2],[[3]],4,5].flatten()
     *   // returns [1,2,3,4,5]
     *
     * @returns array
     */
    if (arguments.length === 0) level = -1;
    else if (level === 0) return this.clone();
    
    for (var i = 0, a = this.clone(); a.some(Array.isArray) && (i != level); i++)
      a = Array.prototype.concat.apply([], a);
      
    return a;
  },
   
   flatten$: function flatten$(level) {
    /**
     * Self-modification version of Array.flatten.
     *
     * @since 1.3.0
     * @param level How deep to go
     * @example
     *  var arr = [[1,2],[[3]],4,5];
     *  arr.flatten$() === arr
     *  arr;
     *   // arr = [1,2,3,4,5]
     *
     * @returns self
     */
    if (arguments.length === 0) level = -1;
      
    for (var i = 0, length = this.length; i < length; i++) {
      if (Array.isArray(this[i]) && level != 0)
        this.splice.apply(this, [i, 1].concat(this[i].flatten(level - 1)));
    }
      
    return this;
  },

  sum: function sum() {
    /**
     * Like it sounds, simply add all the integers contained within the array up together.
     *
     * @since 1.0.0
     * @example
     *  [1,'2',3].sum();
     *    // returns 6
     *
     * @returns int
     */
    return this.reduce(function (a, b) {
      return Number(a) + Number(b);
    });
  },

  product: function product() {
    /**
     * Same as sum, except finds the product of all values within the array. ie. a*b.
     *
     * @since 1.0.0
     * @example
     *  [2,'2',3].product();
     *    // returns 12
     *
     * @returns int
     */
    return this.reduce(function (a, b) {
      return Number(a) * Number(b);
    });
  },

  first: function first(num) {
    /**
     * Returns the first n-number of items within an array. If no parameter is given - this defaults to 1.
     *
     * @since 1.0.0
     * @param num The first n-items
     * @example
     *  [1,2,3].first();
     *    // returns 1
     *
     *  [1,2,3].first(2);
     *    // returns [1,2]
     *
     * @returns array
     */
    return num ? this.slice(0, num || 1) : this[0];
  },
  
  last: function last(num) {
    /**
     * Returns the last n-number of items within an array. If no parameter is given - this defaults to 1.
     *
     * @since 1.0.0
     * @param num The last n-items
     * @example
     *  [1,2,3].last();
     *    // returns 3
     *
     *  [1,2,3].last(2);
     *    // returns [2,3]
     *
     * @returns array
     */
    return num ? this.slice(this.length - (num || 1)) : this[this.length - 1];
  },
  
  clean: function clean() {
    /**
     * Removes all falsey values from the array. These can be either; NaN,undefined,null,0 or false
     *
     * @since 1.0.0
     * @example
     *  [1,null,2,0].clean()
     *    // returns [2,3]
     *
     * @returns array
     */
    return this.filter(function (val) {
      return !! val;
    });
  },
  
  clean$: function clean$() {
    /**
     * Self modification version of Array.clean.
     *
     * @since 1.3.0
     * @example
     *  var arr = [1,null,2,0];
     *  arr.clean$() === arr; // true
     *  arr;
     *    // arr = [2,3]
     *
     * @returns self
     */
    return this.filter$(function (val) {
      return !! val;
    });
  },
  
  filter$: function filter$(callback, scope) {
    /**
     * Self modification version of Array.filter.
     *
     * @since 1.3.0
     * @param callback Will be called on each element. The value returned will become the new value.
     * @param scope The value of this in the callback.
     * @example
     *  var arr = [1,2,3,4,5,6];
     *  arr.filter$(function (n) { return n.even() }) === arr; // true
     *  arr;
     *    // arr = [2,4,6]
     *
     * @returns self
     */
    for (var i = 0; i < this.length; i++)
      if ( ! callback.call(scope, this[i], i, this))
        this.splice(i, 1) && i--;
        
    return this;
  },
  
  map$: function map$(callback, scope) {
    /**
     * Self modification version of Array.map.
     *
     * @since 1.3.0
     * @param callback Will be called on each element. The value returned will become the new value.
     * @param scope The value of this in the callback.
     * @example
     *  var arr = [1,2,3];
     *  arr.map$(function (n) { return n * n }) === arr;
     *  arr;
     *    // arr == [1,4,9]
     *
     * @returns self
     */
    for (var i = 0; i < this.length; i++)
      this[i] = callback.call(scope, this[i], i, this);
        
    return this;
  },
  
  invoke: function invoke(callback) {
    /**
     * Calls a method on each of the objects wihin the array replacing the element with what is returned
     *
     * @since 1.3.0
     * @param property The name of the property within each object to call.
     * @param *params Any params to pass to the function.
     * @example
     *  [1.142,2.321,3.754].invoke('round', 2)
     *    // returns [1.14,2.32,3.75]
     *
     * @returns array
     */
    return this.map(function (val) {
      return val[callback].apply(val, Array.prototype.slice.call(this, 1));
    }, arguments);
  },
  
  invoke$: function invoke$(callback) {
    /**
     * The self modification version of Array#invoke
     *
     * @since 1.3.0
     * @param property The name of the property within each object to call.
     * @param *params Any params to pass to the function.
     * @example
     *  var arr = [1.142,2.321,3.754];
     *  arr.invoke$('round', 2) === arr;
     *  arr;
     *    // a = [1.14,2.32,3.75]
     *
     * @returns self
     */
    return this.map$(function (val) {
      return val[callback].apply(val, Array.prototype.slice.call(this, 1));
    }, arguments);
  },
  
  pluck: function pluck(prop) {
    /**
     * Gets a property from each of the objects within the array and returns it in a seperate array.
     *
     * @since 1.3.0
     * @param property|array The name of the property or array of keys to pluck.
     * @example
     *  ['hello','world','this','is','nice'].pluck('length');
     *    // returns [5, 5, 4, 2, 4]
     *
     *  // Since 1.4.0:
     *  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
     *      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
     *      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' };
     *  
     *  [a,b,c].pluck(['name', 'age']);
     *    // returns [{ name: 'Ann', age: 36 }, { name: 'Bob', age: 21 }, { name: 'Charlie', age: 31 }]
     *
     * @returns array
     */
    return this.map(function (val) {
      if (Array.isArray(prop))
        return Object.filter(val, prop);
      
      return val[prop];
    });
  },
  
  pluck$: function pluck$(prop) {
    /**
     * The self-modification version of Array#pluck
     *
     * @since 1.3.0
     * @param property|array The name of the property or array of keys to pluck.
     * @example
     *  var arr = ['hello','world','this','is','nice'];
     *  arr.pluck$('length') === arr; // true
     *  arr;
     *    // arr = [5, 5, 4, 2, 4]
     *
     *  // Since 1.4.0:
     *  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
     *      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
     *      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' };
     *  
     *  var arr = [a,b,c];
     *  arr.pluck$(['name', 'age']) === arr;
     *  arr;
     *    // arr = [{ name: 'Ann', age: 36 }, { name: 'Bob', age: 21 }, { name: 'Charlie', age: 31 }]
     *    // Note that the original objects are left intact!
     *
     * @returns self
     */
    return this.map$(function (val) {
      if (Array.isArray(prop))
        return Object.filter(val, prop);
        
      return val[prop];
    });
  },
  
  grep: function grep(regex) {
    /**
     * Filters the array only returning elements that match the given regex.
     *
     * @since 1.3.0
     * @param regex The regular expression to match
     * @example
     *  ['hello','world','this','is','cool'].grep(/(.)\1/); // Words with letters that repeat
     *    // returns ['hello', 'cool']
     *
     * @returns array
     */
    return this.filter(function (val) {
      return !! val.match(regex);
    });
  },
  
  grep$: function grep$(regex) {
    /**
     * Self modification version of Array#grep
     *
     * @since 1.3.0
     * @param regex The regular expression to match
     * @example
     *  var arr = ['hello','world','this','is','cool'];
     *  arr.grep$(/(.)\1/) === arr; // true
     *  arr;
     *  // arr = ['hello', 'cool']
     * @returns self
     */
    return this.filter$(function (val) {
      return !! val.match(regex);
    });
  },
  
  sort$: function sort$(sort) {
    /**
     * Self modification version of Array#sort
     *
     * @since 1.3.0
     * @param [callback] The comparison function
     * @example
     *  var arr = ['d','b','a','c','e'];
     *  arr.sort$() == arr; // true
     *  arr;
     *    // arr = ['a','b','c','d','e']
     *
     * @returns self
     */
    var sorted = (typeof sort === 'function') ? this.sort(sort) : this.sort();
    sorted.forEach(function (val, i) {
      this[i] = val;
    }, this);
    return this;
  },
  
  sortBy: function sortBy(cmp, sort) {
    /**
     * Sorts an array based on a value returned by a mapping function called on each element in the array.
     *
     * @since 1.3.0
     * @param mapping The mapping callback to apply to each value.
     * @param [comparison] The comparison callback used in the sort afterwords.
     * @example
     *  ['hello','world','this','is','nice'].sortBy(function (s) { return s.length; }); // Sort by length
     *    // returns ['is', 'this', 'nice', 'hello', 'world']
     *
     *  ['hello','world','this','is','nice'].sortBy('length');
     *    // Same as above
     *
     * @returns array
     */
    if (cmp === undefined)
      return (typeof sort === 'function') ? this.sort(sort) : this.sort();

    if (sort === undefined)
      sort = function (a,b) { return String(a) - String(b) };

    // Get the values we intend to sort
    var arr = this[typeof cmp === 'function' ? 'map' : 'pluck'](cmp).map(function (val, i) {
      return { key: i, val: val };
    });

    return arr.sort(function (a,b) {
      return sort(a.val, b.val);
    }).map(function (val) {
      return this[val.key];
    }, this);
  },
  
  sortBy$: function sortBy$(cmp, sort) {
    /**
     * The self-modifying version of sortBy
     *
     * @since 1.3.0
     * @param mapping The mapping callback to apply to each value.
     * @param [comparison] The comparison callback used in the sort afterwords.
     * @example
     *  var arr = ['hello','world','this','is','nice']
     *  arr.sortBy$('length') === arr; // true
     *  arr;
     *    // arr = ['is', 'this', 'nice', 'hello', 'world']
     *
     * @returns self
     */
    this.sortBy(cmp, sort).forEach(function (v, i) {
      this[i] = v;
    }, this);
    
    return this;
  },
  
  fetch: function fetch(order) {
    /**
     * Fetches the values at the given indexes in the order given.
     *
     * @since 1.3.0
     * @param array|function|*int The keys in order.
     * @example
     *  ['d','b','a','c','e'].fetch([2,1,3,0,4]);
     *    // returns ['a','b','c','d','e']
     *
     *  ['d','b','a','c','e'].fetch(2,1,3);
     *    // returns ['a','b','c']
     *
     *  [1,2,3,4,5,6].fetch(function (n,i) { return n % 6; });
     *    // returns [6,1,2,3,4,5]
     *
     * @returns array
     */
    if (typeof order == 'function')
      order = this.map(order);
    
    if ( ! Array.isArray(order))
      order = Array.prototype.slice.call(arguments);
      
    var arr = [];
    
    order.forEach(function (o, i) {
      arr[o] = this[i];
    }, this);
    
    return arr; 
  }
});

/**
 * ECMA5 Pollyfills
 */
if ( ! Array.isArray)
  extend(Array, 'isArray', function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  });

if ( ! Array.prototype.forEach)
  extend(Array.prototype, 'forEach', function forEach(callback /*, thisArg */) {
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if (i in self) callback.call(thisArg, self[i], i, self);
  });

if ( ! Array.prototype.map)
  extend(Array.prototype, 'map', function map(callback /*, thisArg */) {
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0, arr = new Array(length);
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if (i in self) arr[i] = callback.call(thisArg, self[i], i, self);
    return arr;
  });

if ( ! Array.prototype.filter)
  extend(Array.prototype, 'filter', function filter(callback /*, thisArg */) {
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0, arr = [];
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if ((i in self) && callback.call(thisArg, self[i], i, self))
        arr.push(self[i]);
    return arr;
  });

if ( ! Array.prototype.every)
  extend(Array.prototype, 'every', function every(callback /*, thisArg */) {
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if ((i in self) && ! callback.call(thisArg, self[i], i, self))
        return false;
    return true;
  });
  
if ( ! Array.prototype.some)
  extend(Array.prototype, 'some', function some(callback /*, thisArg */) {
    var self = Object(this), thisArg = arguments[1], length = this.length >>> 0;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    for (var i = 0; i < length; i++)
      if ((i in self) && callback.call(thisArg, self[i], i, self))
        return true;
    return false;
  });
  
if ( ! Array.prototype.reduce)
  extend(Array.prototype, 'reduce', function reduce(callback /*, value */) {
    var self = Object(this), value = arguments[1], length = this.length >>> 0, i = 0, j = i;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    
    if (arguments.length <= 1) {
      if ( ! length) throw new TypeError('Reduce of empty array with no initial value.');
      
      for (i = -1; j < self.length; j++)
        if (Object.hasOwnProperty.call(self, String(j))) { i = j; break; }
      
      if (i === -1) throw new TypeError('Reduce of empty array with no initial value.');
      value = self[i++];
    }
    
    for (; i < length; i++)
      if (Object.hasOwnProperty.call(self, i))
        value = callback.call(undefined, value, self[i], i, self);
      
    return value;
  });
  
if ( ! Array.prototype.reduceRight)
  extend(Array.prototype, 'reduceRight', function reduceRight(callback /*, start */) {
    var self = Object(this), value = arguments[1], length = this.length >>> 0, i = length -1, j = i;
    if ( ! Function.isFunction(callback)) throw new TypeError(callback + ' is not a function.');
    
    if (arguments.length <= 1) {
      if ( ! length) throw new TypeError('Array length is 0 and no initial value given.');
      
      for (i = -1; j >= 0; j--)
        if (Object.hasOwnProperty.call(self, String(j))) { i = j; break; }
      
      if (i === -1) throw new TypeError('Reduce of empty array with no initial value.');
      value = self[i--];
    }
    
    for (; i >= 0; i--)
      if (Object.hasOwnProperty.call(self, i))
        value = callback.call(undefined, value, self[i], i, self);
        
    return value;
  });
  
if ( ! Array.prototype.indexOf)
  extend(Array.prototype, 'indexOf', function indexOf(value /*, index */) {
    var self = Object(this), length = this.length >>> 0, index = (arguments.length <= 1) ? 0 : Number(arguments[1]);
    index = index < 0 ? length - Math.abs(index) : index;
    for (var i = index; i < length; i++)
      if ((i in self) && self[i] === value) return i;
    return -1;
  });
  
if ( ! Array.prototype.lastIndexOf)
  extend(Array.prototype, 'lastIndexOf', function lastIndexOf(value /*, index */) {
    
    if (this === void 0 || this === null)
      throw new TypeError();
      
    var self = Object(this), length = this.length >>> 0, index = length;
    if (length === 0) return -1;
    
    if (arguments.length > 1) {
      index = Number(arguments[1]);
      if (index !== index) index = 0;
      else if (index !== 0 && index !== (1/0) && index !== -(1/0))
        index = (index > 0 || -1) * Math.floor(Math.abs(index));
    }
    
    var i = (index >= 0) ? Math.min(index, length -1) : length - Math.abs(index);

    for (; i >= 0; i--) {
      if ((i in self) && (self[i] === value))
        return i;  
    }
    
    return -1;

  });extend(Date.prototype, {
  
  fuzzyDiff: function fuzzyDiff(date, suffix, prefix) {
    /**
     * Finds the difference between the current date and another date in vague terms.
     *
     * @since 1.5.3
     * @param date The date to offset with
     * @param [suffix='ago'] The suffix to the string
     * @param [prefix='about'] The prefix to the string
     * @example
     *
     *  (new Date()).fuzzyDiff(Date.now() - 5000)
     *    // returns 'about 5 seconds ago'
     *
     * @returns string
     */
    if ( ! (date instanceof Date))
      date = new Date(date);
      
    // TODO: Needs better parsing!
    
    var delta = this.getTime() - date.getTime(),
        units = {
          second: 1000,
          minute: 60000,
          hour: 3600000,
          day: 86400000,
          year: 31557600000
        };
    
    var keys = Object.keys(units), divs = Object.values(units);
    
    for (var i = 0; i < divs.length; i++) {
      if ((delta / divs[i]) < 1 || i == divs.length) {
                
        var time = (delta / divs[i - 1]), key = keys[i - 1];
        if (time > 1) key += 's'; 
        
        if (arguments.length < 3) prefix = (time.round() == time) ? 'exactly' : 'about';
        if (arguments.length < 2) suffix = 'ago';
        
        return '%s %d %s %s'.sprintf(prefix, time.round(), key, suffix);
      }
    }
  }
});


/**
 * ECMA5 Polyfills
 */

if ( ! Date.now)  {
 extend(Date, 'now', function now() {
   return (new Date()).getTime();
 });
}

extend(Date, {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  YEAR: 31557600,
  DECADE: 315576000
});

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("2011-06-15T21:40:05+06:00"))) {
  // XXX global assignment won't work in embeddings that use
  // an alternate object for the context.
  Date = (function (NativeDate) {

    // Date.length === 7
    var Date = function (Y, M, D, h, m, s, ms) {
      var length = arguments.length;
      if (this instanceof NativeDate) {
        var date = length == 1 && String(Y) === Y ? // isString(Y)
        // We explicitly pass it through parse:
        new NativeDate(Date.parse(Y)) :
        // We have to manually make calls depending on argument
        // length here
        length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
        length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
        length >= 5 ? new NativeDate(Y, M, D, h, m) :
        length >= 4 ? new NativeDate(Y, M, D, h) :
        length >= 3 ? new NativeDate(Y, M, D) :
        length >= 2 ? new NativeDate(Y, M) :
        length >= 1 ? new NativeDate(Y) :
        new NativeDate();
        // Prevent mixups with unfixed Date object
        date.constructor = Date;
        return date;
      }
      return NativeDate.apply(this, arguments);
    };

    // 15.9.1.15 Date Time String Format. This pattern does not implement
    // extended years ((15.9.1.15.1), as `Date.UTC` cannot parse them.
    var isoDateExpression = new RegExp("^" +
    "(\\d{4})" + // four-digit year capture
    "(?:-(\\d{2})" + // optional month capture
    "(?:-(\\d{2})" + // optional day capture
    "(?:" + // capture hours:minutes:seconds.milliseconds
    "T(\\d{2})" + // hours capture
    ":(\\d{2})" + // minutes capture
    "(?:" + // optional :seconds.milliseconds
    ":(\\d{2})" + // seconds capture
    "(?:\\.(\\d{3}))?" + // milliseconds capture
    ")?" +
    "(?:" + // capture UTC offset component
    "Z|" + // UTC capture
    "(?:" + // offset specifier +/-hours:minutes
    "([-+])" + // sign capture
    "(\\d{2})" + // hours offset capture
    ":(\\d{2})" + // minutes offest capture
    ")" +
    ")?)?)?)?" +
    "$");

    // Copy any custom methods a 3rd party library may have added
    for (var key in NativeDate)
    Date[key] = NativeDate[key];

    // Copy "native" methods explicitly; they may be non-enumerable
    Date.now = NativeDate.now;
    Date.UTC = NativeDate.UTC;
    Date.prototype = NativeDate.prototype;
    Date.prototype.constructor = Date;

    // Upgrade Date.parse to handle simplified ISO 8601 strings
    Date.parse = function parse(string) {
      var match = isoDateExpression.exec(string);
      if (match) {
        match.shift(); // kill match[0], the full match
        // parse months, days, hours, minutes, seconds, and milliseconds
        for (var i = 1; i < 7; i++) {
          // provide default values if necessary
          match[i] = +(match[i] || (i < 3 ? 1 : 0));
          // match[1] is the month. Months are 0-11 in JavaScript
          // `Date` objects, but 1-12 in ISO notation, so we
          // decrement.
          if (i == 1)
          match[i]--;
        }

        // parse the UTC offset component
        var minutesOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

        // compute the explicit time zone offset if specified
        var offset = 0;
        if (sign) {
          // detect invalid offsets and return early
          if (hourOffset > 23 || minuteOffset > 59)
          return NaN;

          // express the provided time zone offset in minutes. The offset is
          // negative for time zones west of UTC; positive otherwise.
          offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
        }

        // compute a new UTC date value, accounting for the optional offset
        return NativeDate.UTC.apply(this, match) + offset;
      }
      return NativeDate.parse.apply(this, arguments);
    };

    return Date;
    })(Date);
  }extend(Function, {
  
  isFunction: function isFunction(func) {
    /**
     * Determines whether the provided function is really function and whether it's callable.
     *
     * @since 1.5.0
     * @param func The value to test whether it is a function
     * @example
     *  Function.isFunction(Object) // returns true
     *  Function.isFunction(Math) // returns false
     *
     * @returns bool
     */
    return (typeof func === 'function') && !! func.call;
    
  },
    
  compose: function compose(funcs) {
    /**
     * Creates a new function based on the composite of all the functions given. The list of functions can either be given as an array as the first parameter or a continuous set of functions.
     *
     * @since 1.2.0
     * @param funcs* The functions to create the composite
     * @example
     *  var a = function(val) { return val ^ 2; },
     *      b = function(val) { return val / 2; };
     *  var c = Function.compose(a, b);
     *  c(5) == a(b(5));
     *
     * @returns function
     */
    if ( ! Array.isArray(funcs)) {
      funcs = Array.prototype.slice.call(arguments);
    }
    
    funcs = funcs.reverse();
    
    return function (arg) {
      return funcs.reduce(function (a,b) {
        return b(a);
      }, arg);
    }
    
  }
});

extend(Function.prototype, {

  cache: function cache(time, ident) {
    /**
     * Caches the result of the function for specified period of time. The ident parameter allows you to specify your own hashing function for the parameters.
     *
     * @since 1.2.0
     * @param time The number of milliseconds before deleting the cache.
     * @param ident A callback used to map arguments to ids.
     * @example
     *  var fibonacci = function(n) {
     *    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     *  };
     *  fibonacci(35);
     *  // fibonacci(50) will take a several minutes to complete
     *
     *  fibonacci = fibonacci.cache();
     *  fibonacci(35);
     *  // fibonacci(1000) will now take roughly 13ms to complete!
     * 
     * @returns function
     */
    time = isNaN(time) ? -1 : time;
    ident = ident || function (id) {
      return (typeof id == 'object') ? Object.id(id) : id.toString();
    }
    
    var cache = {}, callback = this, timeouts = {};
    
    return function () {
      
      var args = Array.prototype.slice.call(arguments), id = '(' + args.map(ident).join(',') + ')';
      
      if ( ! (id in cache)) cache[id] = callback.apply(callback, args);
      else if (id in timeouts) {
        clearTimeout(timeouts[id]);
        delete timeouts[id];
      }

      if (time > 0) {
        timeouts[id] = setTimeout(function () {
          delete cache[id];
        }, time);
      }
            
      return cache[id];
    }
     
  },
  
  delay: function delay(callback, time, scope) {
    /**
     * Delays a function by a certain amount of time then calls the callback with the result of the function
     *
     * @since 1.2.0
     * @param time The number of milliseconds before calling the function.
     * @param scope The value of this within the callback.
     * @example
     *  Date.now.delay(function (now, then) {
     *    log(now - then); // > 50 (Or very near it!)
     *  }, 50, Date.now());
     * 
     * @returns function
     */
    return setTimeout(function (args) {
      callback.apply(scope, [this()].concat(Array.prototype.slice.call(args, 2)));
    }.bind(this, arguments), time);
    
  },
  
  once: function once(scope) {
    /**
     * Caches a function indefinately. Once the callback is called for the first time it will continue to return that same value. Make sure if the function resides within an instantiated object that you have set the scope parameter.
     *
     * @since 1.4.0
     * @param scope Unfortunately the original function will loose it's scope. Re-add it here.
     * @example
     *  var FooGetter = function() { this.foo = 'bar'; }
     *  FooGetter.prototype.getFoo = function () { return this.foo; }
     *
     *  var obj = new FooGetter();
     *  obj.getFoo = obj.getFoo.once(obj);
     *
     *  obj.getFoo(); // returns 'bar'
     *  obj.foo = 'bat';
     *  obj.getFoo(); // returns 'bar' again!
     * 
     * @returns function
     */
    var called = false, val = null;
    
    return function (args) {
      
      if ( ! called) {
        called = true;
        val = this.apply(scope, args);
      }
      
      return val;
      
    }.bind(this, Array.prototype.slice.call(arguments));
  }
});

/**
 * ECMA5 Pollyfills
 */

if ( ! Function.prototype.bind)
  extend(Function.prototype, 'bind', function bind(thisArg) {
    if ( ! Function.isFunction(this)) throw new TypeError(this + ' is not a function.');
    var args = Array.prototype.slice.call(arguments, 1), self = this, target = function () {};
    
    function bound() {
      return self.apply(this instanceof target ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)));
    }
    
    target.prototype = this.prototype;
    bound.prototype = new target();
    
    return bound;
  });
  extend(Number, {
  
  random: function random(start, end) {
    /**
     * Random number between two values.
     *
     * @since 1.0.0
     * @param [start=0] A number to start from
     * @param [end=1] A number to go to
     * @example
     *  Number.random(100, 1000)
     *    // returns something like 521.61242932 (between 100 and 1000)
     *
     *  Number.random()
     *    // returns something like 0.61242932 (between 0 and 1)
     * 
     * @returns int
     */  
    return (start = start || 0) + (((end || start + 1) - start) * Math.random());
    
  }
});


extend(Number.prototype, {
  
  pow: function pow(n) {
    /**
     * Returns the number to the power of n.
     *
     * @param num The power
     * @example
     *  (2).pow(8)
     *    // returns 256
     *  
     * @returns int
     */
    return Math.pow(this, n);
  },
  
  ordinal: function ordinal(append) {
    /**
     * Returns the number's english ordinal value with the number prepended. Floating numbers will be rounded.
     * 
     * @since 1.5.3
     * @param [append=true] If 
     * @example
     *  (1).ordinal()
     *    // returns '1st'
     *
     *  (32).ordinal(false)
     *    // returns 'nd'
     *
     *  12.31.ordinal()
     *    // returns '12th'
     *
     */
    append = (arguments.length === 0) ? true : !! append;
    var ord = '';
    if (this >= 4 && this <= 20) ord = 'th';
    else {
      switch (this % 10) {
        case 1: ord = 'st'; break;
        case 2: ord = 'nd'; break;
        case 3: ord = 'rd'; break;
        default: ord = 'th'; break;
      }
    }
    return (append ? this.round() : '') + ord;
  },
  
  chr: function () {
    /**
     * Gets the current integer's representing string character.
     *
     * @since 1.1.0
     * @example
     *  (72).chr()
     *    // returns 'H'
     * 
     * @returns string
     */
    return String.fromCharCode(this);
    
  },
  
  odd: function () {
    /**
     * Determine's whether this integer is an odd number. *** Deprecated *** as of 1.6.0 this will be isOdd()
     *
     * @since 1.1.0
     * @example
     *  (12).odd() // false
     *  (13).odd() // true
     * 
     * @returns boolean
     */
    return ! this.even();
    
  },
  
  even: function () {
    /**
     * Determine's whether this integer is an even number. *** Deprecated *** as of 1.6.0 this will be isEven()
     *
     * @since 1.1.0
     * @example
     *  (12).even() // true
     *  (13).even() // false
     * 
     * @returns boolean
     */
    return (this % 2) == 0;
    
  },
  
  gcd: function gcd() {
    /**
     * Calculates the Greatest common divisor between a set of numbers. Also known as the greatest common factor. This uses Stein's binary algorithm.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (12).gcd(6, 9)
     *    // returns 3
     * 
     * @returns integer
     */
    return Array.prototype.slice.call(arguments).reduce(function (a, b) {
      
      if (a == 0 || b == 0)
        return a | b;
        
      for (var shift = 0; ((a | b) & 1) == 0; shift++) {
        a >>= 1; b >>= 1;
      }
        
      while ((a & 1) == 0) a >>= 1;
        
      do {
        
        while ((b & 1) == 0) b >>= 1;
          
        if (a < b) b -= a;
        else {
          var diff = a - b;
          a = b;
          b = diff;
        }
        
        b >>= 1;
      
      } while (b != 0);
      
      return a << shift;
      
    }, this);
    
  },
  
  lcm: function lcm() {
    /**
     * Calculates the lowest common multiple between a set of numbers. Uses GCD within the caluclation.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (21).lcm(6)
     *    // returns 42
     * 
     * @returns integer
     */
    var nums = Array.prototype.slice.call(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  },
  
  ceil: function ceil() {
    /**
     * Rounds up. Same as Math.ceil().
     *
     * @since 1.1.0
     * @example
     *  12.32.ceil()
     *    // returns 13
     * 
     * @returns integer
     */
    return Math.ceil(this);
    
  },
  
  floor: function floor() {
    /**
     * Rounds down. Same as Math.floor().
     *
     * @since 1.1.0
     * @example
     *  12.32.floor()
     *    // returns 12
     * 
     * @returns integer
     */
    return Math.floor(this);
    
  },
  
  abs: function abs() {
    /**
     * Calculates the magnitude or absolute of a number. Same as Math.abs().
     *
     * @since 1.1.0
     * @example
     *  (-21).abs()
     *    // returns 21
     * 
     * @returns integer
     */
    return Math.abs(this);
    
  },
  
  round: function round(digits) {
    /**
     * Rounds the number to a given number of digits. Negative numbers are possible. This is similar to Ruby's round().
     *
     * @since 1.1.0
     * @param [digits=0] The number of digits
     * @example
     *  1.5.round()
     *    // returns 2
     *
     *  19231.32.round(-3)
     *    // returns 1900
     * 
     * @returns integer
     */
    digits = digits || 0;
    
    if (digits == 0) {
      return Math.round(this);
    }
    else if (digits < 0) {
      return Number(this.toPrecision(this.floor().toString().length - digits.abs()));
    }
    else {
      return Number(this.toFixed(digits));
    }

  },
  
  radix: function radix(base, size, character) {
    /**
     * Transforms the number to a string base. The string will be padded with 0s if necessary.
     *
     * @since 1.3.0
     * @param radix Which base to use to represent the number (2 >= r <= 36).
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (127).radix(8, 5, '0');
     *    // returns '00177'
     * 
     * @returns string
     */
    return this.toString(base).pad(-size, (character || '0'));
    
  },
  
  bin: function bin(size, character) {
    /**
     * Binary representation of the number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (13).bin();
     *    // returns '1101'
     *
     *  '0b' + (63).bin(8);
     *    // returns 0b00111111
     * 
     * @returns string
     */
    return this.radix(0x02, size, character);
    
  },
  
  oct: function oct(size, character) {
    /**
     * Octal representation of the number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (8).oct();
     *    // returns 10
     *
     *  '0' + (8).oct(4);
     *    // returns 01000
     * 
     * @returns string
     */
    return this.radix(0x08, size, character);
    
  },
  
  dec: function dec(size, character) {
    /**
     * Decimal representation of a number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (80).dec(4);
     *    // returns '0080'
     * 
     * @returns string
     */
    return this.radix(0x0A, size, character);
    
  },
  
  hexl: function hexl(size, character) {
    /**
     * Hexadecimal representation of the number with lower-case character notations.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hexl();
     *    // returns '3ff'
     *
     *  '0x' + (15).hexl(2);
     *    // returns '0x0f'
     * 
     * @returns string
     */
    return this.radix(0x10, size, character);
    
  },
  
  hex: function hex(size, character) {
    /**
     * Hexadecimal representation of the number with uppercase-case character notations.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (1023).hex();
     *    // returns '3FF'
     *
     *  '0x' + (15).hex(2);
     *    // returns '0x0F'
     * 
     * @returns string
     */
    return this.radix(0x10, size, character).toUpperCase();
    
  },
  
  abbr: function abbr(digits, binary) {
    /**
     * The shorthand abbreviation for a number. You're a programmer! Normal people aren't. Binary defaults to false. BOOO!
     *
     * @since 1.3.0
     * @param [precision=0] The number of digits to include after the decimal point.
     * @param [binary=false] Whether the devisor should be a power of 2.
     * @example
     *  (1024).abbr();
     *    // returns '1K'
     *
     *  (1024).abbr(3);
     *    // returns '1.024K'
     *
     *  (1024).abbr(3, true);
     *    // returns '1.000K'
     * 
     * @returns string
     */
    binary = !! (binary == undefined ? false : binary);
    
    var prefixes = {
      k: binary ? 1 << 10 : 1e03,
      M: binary ? 1 << 20 : 1e06,
      G: binary ? 1 << 30 : 1e09,
      T: binary ? Math.pow(2, 40) : 1e12,
      P: binary ? Math.pow(2, 50) : 1e15,
      E: binary ? Math.pow(2, 60) : 1e18,
      Z: binary ? Math.pow(2, 70) : 1e21,
      Y: binary ? Math.pow(2, 80) : 1e24
    }
    
    var keys = Object.keys(prefixes), divs = Object.values(prefixes);
    
    if (divs[0] > this) return this.toFixed(digits);
    
    for (var i = 0; i < divs.length; i++)
      if ((this / divs[i]) < 1)
        return (this / divs[i - 1]).toFixed(digits) + keys[i - 1];
                
    return (this / divs.last()).toFixed(digits) + keys.last();
    
  }
});extend(Object, {
  
  follow: function follow(obj, keys, sep){
    /**
     * Follows a set of keys deep into the recursive object and returns the end value.
     *
     * @since 1.5.3
     * @param obj The object to follow.
     * @param keys Either an array of keys or a string of key names seperated by dots.
     * @param [seperator='.']  
     * @example
     *  var obj = {a:{b:{c:'d'}}};
     *  Object.follow(obj, ['a','b','c'])
     *    // returns 'd'
     *
     *  Object.follow(obj, 'a.b') === obj.a.b;
     *    // returns true
     *
     *  Object.follow(obj, 'a/b', '/') === obj.a.b;
     *    // returns true
     *
     * @returns mixed
     */
    if ( ! Array.isArray(keys)) {
      if (typeof keys !== 'string')
        throw new TypeError('Object.follow requires keys to either be an array or string value.');
      
      keys = keys.split(sep || '.');
    }
    
    return keys.reduce(function (o,k) {
      if (o && (k in o))
        return o[k];
    }, obj);
  },
  
  value: function value(obj, key /*, value*/) {
    
    var desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc && ! Object.getOwnPropertyDescriptor(obj, key).writable)
      return obj[key];
    
    return (arguments.length === 2) ? obj[key] : (obj[key] = arguments[2]);
  },
  
  remove: function remove(obj, key) {
    /**
     * Removes a value from the object respecting property descriptors (configurable = false then the value will not be deleted).
     *
     * @since 1.5.0
     * @param object The object to delete from
     * @param key The name of the property to delete
     * @example
     *  var obj = Object.create(null, {
     *    a: { value: 'b' },
     *    b: { value: 'c', configurable: true }
     *  });
     * 
     *  Object.remove(obj, 'a') // returns false, and value isn't removed.
     *  Object.remove(obj, 'b') // returns true, and value is removed.
     *
     * @returns bool
     */
     
    if ( ! Object.getOwnPropertyDescriptor(obj, key).configurable)
      return false;
    
    if (obj.__ownPropertyDescriptors__)
      delete obj.__ownPropertyDescriptors__[key];
      
    return delete obj[key];
  },
  
  id: function id(obj) {
    /**
     * Returns a unique string representing the object instance every variable can have a uuid. Note the UUID is only valid whilst withing the current VM.
     *
     * @since 1.5.0
     * @param object
     * @example
     *  var a = {}, b = {};
     *  Object.id(a);
     *    // returns something like 412
     *
     *  Object.id(a) == Object.id(b)
     *    // false
     *
     *  Object.id(a) == Object.id(a)
     *    // true
     * 
     * @returns string
     */
    if ( ! objectIdStore.contains(obj))
      objectIdStore.push(obj);

    return objectIdStore.indexOf(obj);
    
  },
  
  alias: function alias(object, property, alias, complete) {
    /**
     * Creates an alias of a property within an object. A true alias requires getters/setters which can be slow so by default we don't bother. If you still wan't it set complete to true.
     *
     * @since 1.2.0
     * @param object The object where the property lurks.
     * @param property The name of the original property
     * @param alias A new alias to assign to that object
     * @param [complete=false] A new alias to assign to that object
     * @example
     *  var obj = {1:2,3:4};
     *  Object.alias(obj, 3, 6);
     *  
     *  obj[3] === obj[6]
     * 
     * @returns self
     */
    var desc = Object.getOwnPropertyDescriptor(object, property);
    
    if ( ! complete) {
      
      Object.defineProperty(object, alias, desc);
    }
    else {
    
      if (('get' in desc ) || ('value' in desc)) {
        delete desc['value'], delete desc['writable'];
        desc.get = function () {
          return object[property];
        }
      }

      desc.set = function (val) {
        return object[property] = val;
      }

      Object.defineProperty(object, alias, desc);
    }
    
    return object;

  },

  values: function values(obj) {
    /**
     * Gets all the enumerable values within an object.
     *
     * @since 1.0.0
     * @param object
     * @example
     *  Object.values({1:2,3:4});
     *    // returns [2,4] 
     * 
     * @returns array
     */
    var arr = [];
    Object.keys(obj).forEach(function (key) {
      arr.push(obj[key]);
    });
    
    return arr;
    
  },
  
  forEach: function forEach(obj, callback, scope) {
    /**
     * A fast looping mechanism for objects. Like Array.forEach.
     *
     * @since 1.0.0
     * @param object
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  Object.forEach({1:2,3:4}, function (key, val, obj) {
     *    log(key + ':' + val)
     *  });
     *  // > 1:2
     *  // > 3:4
     * 
     * @returns void
     */
    return Object.keys(obj).forEach(function (key) {
      return callback.call(scope, key, obj[key], obj);
    });
    
  },
  
  isObject: function isObject() {
    /**
     * Returns whether all the given parameters are objects
     *
     * @since 1.0.0
     * @param *objects
     * @example
     *  Object.isObject({1:2,3:4});
     *    // returns true
     *  
     *  Object.isObject(function () { });
     *    // returns true
     *
     *  Object.isObject(123, {});
     *    // returns false
     * 
     * @returns bool
     */
    return Array.prototype.slice.call(arguments).every(function (value) {
      return Object(value) === value;
    });
    
  },
  
  each: function each(obj, callback, scope) {
    /**
     * Provides a utility to quickly iterate through enumerable properties of an object.
     *
     * @since 1.0.0
     * @param object The object you want to iterate through
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  Object.each({1:2,3:4}, function (key, val, obj) {
     *    return (key + ':' + val);
     *  });
     *  // returns '1:2'
     * 
     * @returns mixed
     */
    var key, result;
    for (key in obj)
      if (key !== '__proto__')
        if ((result = callback.call(scope, key, obj[key], this)) !== undefined)
          return result;
    
  },
  
  map: function map(object, callback, scope) {
    /**
     * Similar to Array.map except for enumerable object properties.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  Object.map({1:2,3:4}, function (key, val) {
     *    return key * val;
     *  });
     *  // returns {1:2,3:12}
     * 
     * @returns object
     */
    var obj = Object.clone(object);

    Object.map$(obj, callback, scope);

    return obj;
    
  },
  
  map$: function map$(obj, callback, scope) {
    /**
     * A self-modification version of Object.map.
     *
     * @since 1.3.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4};
     *  Object.map$(obj, function (key, val) {
     *    return key * val;
     *  }) === obj;
     *  obj;
     *  // obj = {1:2,3:12}
     * 
     * @returns self
     */
     Object.forEach(obj, function (key, val) {
       Object.value(obj, key, callback.call(scope, key, val));
     });
     
     return obj;
    
  },
  
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    /**
     * Retrieves object property descriptors for every property within an object
     *
     * @since 1.0.0
     * @param object The object you want to get the property descriptors for
     * @example
     *  Object.getOwnPropertyDescriptors({1:2,3:4});
     *  // returns { 
     *  //  '1': {
     *  //     value: 2,
     *  //     writable: true,
     *  //     enumerable: true,
     *  //     configurable: true
     *  //   },
     *  //   '3': {
     *  //     value: 4,
     *  //     writable: true,
     *  //     enumerable: true,
     *  //     configurable: true
     *  //   }
     *  // } 
     * @returns array
     */
    var descriptors = {};

    Object.getOwnPropertyNames(object).forEach(function (key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(object, key);
    });

    return descriptors;
    
  },
  
  reduce: function reduce(obj, callback, start, scope) {
    /**
     * Like Array.reduce except for objects. Reduces the object down into a single value.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param callback The function to call on each iteration
     * @param [start=undefined] The initial value
     * @example
     *  Object.reduce({1:2,3:4}, function (group, key, val) {
     *    return group + key + val;
     *  }, '0');
     *  // returns '01234'
     * 
     * @returns mixed
     */
    Object.forEach(obj, function (key, val) {
      start = callback.call(scope, start, key, obj[key]);
    });
    
    return start;
    
  },
  
  merge: function merge(objects, level) {
    /**
     * Merges more than one enumerable object into 1. This method is by default non-recursive but this can be changed by setting level to -1.
     *
     * @since 1.0.0
     * @param object The array of objects you wish to merge
     * @param [level=0] How many levels down to merge recursively.
     * @example
     *  Object.merge({1:2}, {3:4}, {5:6});
     *    // returns {1:2,3:4,5:6}
     *  
     *  Object.merge([{1:2}, {3:4}, {5:6}]);
     *    // returns {1:2,3:4,5:6}
     *
     *  Object.merge({1:2,3:{4:5}}, {1:3,3:{5:6}});
     *    // returns {1:3,3:{5:6}}
     *
     *  // The second parameter with the first being an array of objects is how many levels deep to merge (recursive merge). This defaults to 0. -1 will recursively merge indefinitely.
     *  Object.merge([{1:2,3:{4:5}}, {1:3,3:{5:6}}], 1);
     *    // returns {1:3,3:{4:5,5:6}}
     * 
     * @returns object
     */
    if (Object.isObject(objects, level)) {
      objects = Array.prototype.slice.call(arguments), level = 0;
    }
    
    level = (level === undefined) ? 0 : level;
    
    return objects.reduce(function (group, obj) {
      Object.forEach(obj, function (key, val) {
        if ( ! val in group || level == 0 || ! Object.isObject(group[key]) || ! Object.isObject(val)) {
          group[key] = val;
        }
        else {
          group[key] = Object.merge([group[key], val], level - 1);
        }
      });
      
      return group;
      
    }, {});
    
  },
  
  merge$: function merge$(object, objects, level) {
    /**
     * The self-modification version of Object.merge. Except all values are merged into the first parameter
     *
     * @since 1.4.0
     * @param object The object we're merging into
     * @param object|*objects The array or list of of objects you wish to merge
     * @param [level=0] How many levels down to merge recursively.
     * @example
     *  var obj = {1:2};
     *
     *  Object.merge$(obj, {3:4}, {5:6});
     *    // obj = {1:2,3:4,5:6}
     *
     *  Object.merge$(obj, [{7:8}, {9:10}]);
     *    // obj = {1:2,3:4,5:6,7:8,9:10}
     *
     *  // See Object.merge for a recursive example.
     * 
     * @returns self
     */
    if (Array.isArray(objects))
      objects = [object].concat(objects);
    else {
      objects = Array.prototype.slice.call(arguments);
      level = undefined;
    }

    var obj = Object.merge.apply(undefined, objects, level);

    Object.filter$(object, function (key, val) { return Object.hasOwnProperty.call(obj, key) });
    Object.map$(object, function (key, val) { return obj[key]; });

    Object.keys(obj).diff(Object.keys(object)).forEach(function (key) {
      Object.value(object, key, obj[key]);
    });

    return object;
    
  },
  
  clone: function clone(obj, inherit) {
    /**
     * Clones an object by creating a new object with the same parent prototype and then manually adding all the property descriptors.
     *
     * @since 1.0.0
     * @param object The object you want to clone
     * @param [inherit=true] Whether to merge in the values of the parent.
     * @example
     *  function A() { }
     *  Object.defineProperty(A.prototype, 'foo', { value: 'bar' });
     *  var a = new A(), b = Object.clone(a);
     *   
     *  a.foo == b.foo
     *    // returns true 
     *   
     *  a == b
     *    // returns false
     * 
     * @returns object
     */
    inherit = (inherit === undefined) ? true : false;
        
    var obj = Object.create(Object.getPrototypeOf(obj), inherit ? Object.getOwnPropertyDescriptors(obj) : undefined);
      
    return obj;
    
  },

  filter: function filter(object, callback, scope) {
    /**
     * Like Array.filter except for objects. Only enumerable values are filtered.
     *
     * @since 1.0.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  Object.filter({1:2,3:4,5:6}, function (key, val, object) {
     *    return key == 3;
     *  });
     *  // returns {3:4} 
     *
     *  // Since 1.4.0:
     *  Object.filter({1:2,3:4,5:6}, [3,5]);
     *  // returns {3:4,5:6}
     * 
     * @returns object
     */
    return Object.filter$(Object.clone(object), callback, scope);
    
  },
  
  filter$: function filter$(obj, callback, scope) {
    /**
     * Self-modification version of Object.filter.
     *
     * @since 1.3.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, function (key, val, object) {
     *    return key == 3;
     *  }) === obj;
     *  obj;
     *  // obj = {3:4} 
     *
     *  // Since 1.4.0:
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, [1,3]) === obj;
     *  obj;
     *  // obj = {1:2,3:4}
     * 
     * @returns self
     */
    if (Array.isArray(callback)) var keys = callback.invoke('toString');
    Object.forEach(obj, function (key, val) {
      if (Array.isArray(callback)) {
        if ( ! keys.contains(key))
          Object.remove(obj, key);
      }
      else if (callback.call(scope, key, val, obj) === false)
        Object.remove(obj, key);
    });
    
    return obj;
    
  },
  
  clean: function clean(obj) {
    /**
     * Like Array.clean except for objects. The following values are filtered: NaN, undefined, null, 0 or false
     *
     * @since 1.0.0
     * @param object The object you want to clean
     * @example
     *  Object.clean({1:false,2:0,3:NaN,4:null,5:6});
     *    // returns {5:6} 
     * 
     * @returns object
     */
    return Object.filter(obj, function (key, val) {
      return !! val;
    });
    
  },
  
  clean$: function clean$(obj) {
    /**
     * A self-modification version of Object.clean.
     *
     * @since 1.3.0
     * @param object The object you want to clean
     * @example
     *  var obj = {1:false,2:0,3:NaN,4:null,5:6};
     *  Object.clean$(obj) === obj;
     *  obj;
     *    // obj = {5:6} 
     * 
     * @returns object
     */
    return Object.filter$(obj, function (key, val) {
      return !! val;
    });
    
  },
  
  size: function size(obj) {
    /**
     * Calculates the number of enumerable properties within the object
     *
     * @since 1.3.0
     * @param object The object you want to count
     * @example
     *  var obj = {1:2,3:4,5:6,7:8};
     *  Object.size(obj);
     *    // returns 4
     * 
     * @returns integer
     */
    return Object.keys(obj).length;
    
  },
  
  combine: function combine(keys, values) {
    /**
     * Combines an array of keys and an array of values (of equal lengths) to create a new enumerable object.
     *
     * @since 1.4.0
     * @param array The keys
     * @param array The values
     * @example
     *  var keys = ['Harry', 'Bill', 'Larry'], values = [32, 52, 13];
     *  Object.combine(keys, values);
     *    // returns { 'Harry': 32, 'Bill': 52, 'Larry': 13 }
     * 
     * @returns object
     */
    var obj = {};
    
    keys.forEach(function (key, i) {
      obj[key] = values[i];
    });
    
    return obj;
    
  },
  
  hash: function hash(object) {
    /**
     * Creates an enumerable wrapper around the given objcet. Useful for simple hashes and not complex classes. Added functions: length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = Object.hash({a:1,b:2,c:3,d:4});
     *  obj.keys();
     *  obj.size();
     *  obj.values();
     *  // size(), keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.hash$(Object.clone(object));
    
  },
  
  hash$: function hash$(object) {
    /**
     * The self modification version of Object.hash. New methods are defined to the current object rather than a clone.
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = {a:1,b:2,c:3,d:4};
     *  Object.hash$(obj);
     *  obj.keys();
     *  obj.size();
     *  obj.values();
     *  // size(), keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.defineProperties(object, {

      size: { value: function () {
        return Object.size(this);
      }, writable: true, enumerable: false, configurable: true },

      keys: { value: function keys(callback, scope) {
        return Object.keys(this);
      }, writable: true, enumerable: false, configurable: true },

      each: { value: function each(callback, scope) {
        return Object.each(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      forEach: { value: function forEach(callback, scope) {
        return Object.forEach(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      map: { value: function map(callback, scope) {
        return Object.map(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      map$: { value: function map$(callback, scope) {
        return Object.map$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      reduce: { value: function reduce(callback, start) {
        return Object.reduce(this, callback, start);
      }, writable: true, enumerable: false, configurable: true },

      filter: { value: function filter(callback, scope) {
        return Object.filter(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      filter$: { value: function filter$(callback, scope) {
        return Object.filter$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clean: { value: function clean(callback, scope) {
        return Object.clean(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clean$: { value: function clean$(callback, scope) {
        return Object.clean$(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      clone: { value: function clone(callback, scope) {
        return Object.clone(this, callback, scope);
      }, writable: true, enumerable: false, configurable: true },

      merge: { value: function merge() {
        return Object.merge.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
      }, writable: true, enumerable: false, configurable: true },

      merge$: { value: function merge$() {
        return Object.merge$.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
      }, writable: true, enumerable: false, configurable: true }
      
   });
  }
});

/**
 * ECMA5 Polyfills
 */

if ( ! Object.getPrototypeOf)
  extend(Object, 'getPrototypeOf', function getPrototypeOf(object) {
    return object.__proto__ || object.constructor.prototype || protoStore[Object.id(object)];
  });
  
if ( ! Object.getOwnPropertyDescriptor || domDefineProperty) {
  var oldGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, objectDescriptorStore = {};
  extend(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(object, property) {
    if (object.nodeType && oldGetOwnPropertyDescriptor) return oldGetOwnPropertyDescriptor(object, property);
    if ( ! Object.isObject(object)) throw new TypeError(object + ' is not an object.');
    if ( ! Object.prototype.hasOwnProperty.call(object, property)) return;
    
    var descriptor = { enumerable: Object.prototype.propertyIsEnumerable.call(object, property),
      writable: true, configurable: true }, getter, setter, id = Object.id(object);
    
    if ((object instanceof Function && ['arguments','length','name','prototype','caller'].contains(property)) ||
        (object === Number && ['NaN','NEGATIVE_INFINITY','POSITIVE_INFINITY','MAX_VALUE','MIN_VALUE'].contains(property)) ||
        (object === Math && ['LN10','PI','E','LOG10E','SQRT2','LOG2E','SQRT1_2','LN2'].contains(property)))
      descriptor = {configurable:false, writable:false, enumerable:false};
      
    if (object instanceof RegExp && ['lastIndex','multiline','global','source','ignoreCase'].contains(property))
      descriptor = {configurable:false, writable:(property == 'lastIndex'), enumerable:false};
    
    if ((Array.isArray(object) || String.isString(object)) && property === 'length')
      descriptor = { configurable:false, writable:true, enumerable:false }
      
    else if (objectDescriptorStore[id] && (property in objectDescriptorStore[id]))
      descriptor = objectDescriptorStore[id][property];
    
    if (Object.prototype.__lookupGetter__ && (getter = object.__lookupGetter__(property))) {
      descriptor.writable = false;
      descriptor.get = getter;
    }
    if (Object.prototype.__lookupSetter__ && (setter = object.__lookupSetter__(property))) {
      descriptor.writable = false;
      descriptor.set = setter;
    }
    
    if ( ! ('set' in descriptor || 'get' in descriptor))
      descriptor.value = object[property];
        
    return descriptor;
  });
}

if ( ! Object.getOwnPropertyNames) {
  extend(Object, 'getOwnPropertyNames', function getOwnPropertyNames(object) {
    
    var names = Object.keys(object);
    
    if ((typeof globals !== 'undefined' && object === globals) || (typeof window !== 'undefined' && object === window))
      names.push('Infinity','NaN','undefined','decodeURI','encodeURIComponent','isNaN','decodeURIComponent','eval','parseFloat','encodeURI','isFinite','parseInt');
    
    if (object instanceof Function)
      names.push('arguments','length','name','prototype','caller');
    
    if (object === Number)
      names.push('NaN','NEGATIVE_INFINITY','POSITIVE_INFINITY','MAX_VALUE','MIN_VALUE');
    else if (object === Math)
      names.push('LN10','PI','E','LOG10E','SQRT2','LOG2E','SQRT1_2','LN2','cos','pow','log','tan','sqrt','ceil','asin','abs','max','exp','atan2','random','round','floor','acos','atan','min','sin');
    else if (object === String)
      names.push('fromCharCode');
    else if (object === Date)
      names.push('UTC','parse');
    else if (object === RegExp)
      names.push('$*','$3','$`','$9','rightContext','multiline','$7','lastParen','$input','$+','$&','leftContext','$8','$4','$1','$\'','$_','input','lastMatch','$2','$5','$6');
    else if (object === Date.prototype)
      names.push('constructor','toUTCString','setMinutes','setUTCMonth','getMilliseconds','getTime','getMinutes','getUTCHours','toString','setUTCFullYear','setMonth','getUTCMinutes','getUTCDate','setSeconds','toLocaleDateString','getMonth','toTimeString','toLocaleTimeString','setUTCMilliseconds','setYear','getUTCFullYear','getFullYear','getTimezoneOffset','setDate','getUTCMonth','getHours','toLocaleString','toISOString','toDateString','getUTCSeconds','valueOf','setUTCMinutes','getUTCDay','setUTCDate','setUTCSeconds','getYear','getUTCMilliseconds','getDay','setFullYear','setMilliseconds','setTime','setHours','getSeconds','toGMTString','getDate','setUTCHours');
    else if (object === Object.prototype)
      names.push('toString', 'toLocaleString','hasOwnProperty','valueOf','constructor','propertyIsEnumerable','isPrototypeOf');
    else if (object === Number.prototype)
      names.push('toExponential', 'toString','toLocaleString','toPrecision','valueOf','constructor','toFixed');
    else if (object === RegExp.prototype)
      names.push('toString','constructor','exec','compile','test');
    else if (object === String.prototype)
      names.push('length','constructor','concat','localeCompare','substring','italics','charCodeAt','strike','indexOf','toLowerCase','toString','toLocaleLowerCase','replace','toUpperCase','fontsize','split','substr','sub','charAt','blink','lastIndexOf','sup','fontcolor','valueOf','link','bold','anchor','small','search','fixed','big','match','toLocaleUpperCase','slice');
    else if (object === Array.prototype)
      names.push('length','constructor','concat','sort','join','indexOf','toString','splice','shift','unshift','toLocaleString','reverse','pop','push','slice');
    else if (object === Function.prototype)
      names.push('toString','constructor','call','apply','arguments','length','name','prototype','caller')
    else {
      if (object instanceof RegExp) names.push('lastIndex','multiline','global','source','ignoreCase');
      else if (Array.isArray(object) || String.isString(object)) names.push('length');
    }
        
    return names.concat(Object.keys(objectDescriptorStore[Object.id(object)] || {})).unique();
  });
}
  
if ( ! Object.create) {
  var protoStore = [];
  extend(Object, 'create', function create(prototype, descriptors) {
    
    if (prototype !== null && Object(prototype) !== prototype)
      throw new TypeError('Object prototype may only be an Object or null');
    
    var object = {};
    
    if (prototype !== null)  {
      var type = function () {}
      type.prototype = prototype;
      object = new type();
    }
    if (descriptors !== undefined)
      Object.defineProperties(object, descriptors);
    
    if (object.__proto__ !== undefined) object.__proto__ = prototype;
    else protoStore[Object.id(object)] = prototype;
    
    return object;
  });
}
  
if ( ! Object.defineProperty || domDefineProperty) {
  var oldDefineProperty = Object.defineProperty, definePropertyError = function (object, name, descriptor) {
    if ( ! Object.isObject(descriptor)) return 'Property description must be an object: ' + descriptor;
    if ( ! Object.isObject(object)) return 'Object.defineProperty called on non-object';
    
    if ('get' in descriptor) {
      if ( ! object.__defineGetter__) return 'Getters are not supported on this javascript engine.';
      if (! Function.isFunction(descriptor.get)) return 'Getter must be a function: ' + descriptor.get;
    }
    
    if ('set' in descriptor) {
      if ( ! object.__defineSetter__) return 'Setters are not supported on this javascript engine.';
      if (! Function.isFunction(descriptor.set)) return 'Setter must be a function: ' + descriptor.get;
    }
    
    if (('get' in descriptor || 'set' in descriptor) && ('value' in descriptor || descriptor.writable))
      return 'A property cannot both have accessors and be writable or have a value: ' + object;
  }
  extend(Object, 'defineProperty', function defineProperty(object, name, descriptor) {
    if (object.nodeType && oldDefineProperty) oldDefineProperty(object, name, descriptor);
    var id = Object.id(object), error, prototype;
    if ((error = definePropertyError(object, name, descriptor))) throw new TypeError(error);
    if (object.__defineGetter__) {
      if ((name in object) && (object.__lookupGetter__(name))) {
        prototype = object.__proto__;
        object.__proto__ = Object.prototype;
        delete object[name];
      }
      if ('get' in descriptor) object.__defineGetter__(name, descriptor.get);  
      if ('set' in descriptor) object.__defineSetter__(name, descriptor.set);
    }
    if ( ! objectDescriptorStore[id])     objectDescriptorStore[id] = {};
    if ( ! descriptor.writable)     descriptor.writable = false;
    if ( ! descriptor.configurable) descriptor.configurable = false;
    if ( ! descriptor.enumerable)   descriptor.enumerable = false;
    
    if ( ! ('get' in descriptor || 'set' in descriptor))
      object[name] = descriptor.value;
    
    objectDescriptorStore[id][name] = descriptor;
        
    if (prototype) object.__proto__ = prototype;
    
    return object;
  });
}

if ( ! Object.defineProperties || domDefineProperty)
  extend(Object, 'defineProperties', function defineProperties(object, descriptors) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.defineProperties called on non-object');
    var name, error;
    for (name in descriptors)
      if (error = definePropertyError(object, name, descriptors[name]))
        throw new TypeError(error);
    
    for (name in descriptors)
      Object.defineProperty(object, name, descriptors[name]);
      
    return object;
  });
  
if ( ! Object.seal)
  var sealedStore = [];
  extend(Object, 'seal', function seal(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.seal called on non-object');
    sealedStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isSealed)
  extend(Object, 'isSealed', function isSealed(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isSealed called on non-object');
    return !! sealedStore[Object.id(object)];
  });
  
if ( ! Object.freeze)
  var frozenStore = [];
  extend(Object, 'freeze', function freeze(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.freeze called on non-object');
    frozenStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isFrozen)
  extend(Object, 'isFrozen', function isFrozen(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isFrozen called on non-object');
    return !! frozenStore[Object.id(object)];
  });
  
if ( ! Object.preventExtensions)
  var preventExtensionsStore = [];
  extend(Object, 'preventExtensions', function preventExtensions(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.preventExtensions called on non-object');
    preventExtensionsStore[Object.id(object)] = true;
    return object;
  });

if ( ! Object.isExtensible)
  extend(Object, 'isExtensible', function isExtensible(object) {
    if ( ! Object.isObject(object)) throw new TypeError('Object.isExtensible called on non-object');
    var id = Object.id(object);
    return ! preventExtensionsStore[id] && ! sealedStore[id];
  });
  
if ( ! Object.keys)
  extend(Object, 'keys', function keys(object) {
    if (object !== Object(object)) throw new TypeError('Object.keys called on non-object');
    var keys = [], key;
    for (key in object)
      if (object.hasOwnProperty(key))
        keys.push(key);
    keys = keys.filter(function (key) {
      return Object.prototype.propertyIsEnumerable.call(object, key);
    });
    
    if (String.isString(object) && ! (0 in (new String(' ')))) {
      keys = keys.concat(Array.range(0, object.length - 1));
    }
      
    return keys.map(String);
  });
  
if (domDefineProperty) {
  var oldPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;
  Object.prototype.propertyIsEnumerable = function propertyIsEnumerable(key) {
    var desc = objectDescriptorStore[Object.id(this)];
    if (desc && desc[key]) return desc[key].enumerable === true;
    else if (oldPropertyIsEnumerable) oldPropertyIsEnumerable.call(this, key);
    else { for (var name in this) if (name == key) return true; }
    return true;
  };
}extend(RegExp, {
  
  escape: function escape(input) {
    /**
     * Escapes the input text to make it safe for use in a regular expression
     *
     * @since 1.5.3
     * @param input The text to escape
     * @example
     *  RegExp.escape('U$es |()ts +f r*ser^ed keyw()rds.')
     *    // returns 'U\$es \|\(\)ts \+f r\*ser\^ed keyw\(\)rds\.'
     *
     */
    return input.replace(/([/'*+?|()\[\]{}.^$])/g, '\\$1');
  }
});if (typeof module !== 'undefined' && module.exports) {
  module.exports.repl = function () {
    var vm = require('vm'), repl = require('repl');
    process.stdin.removeAllListeners('keypress');
    var ctx = repl.start('toolkit> ').context;
    ctx.Array = Array; ctx.Object = Object; ctx.Number = Number; ctx.Date = Date;
    ctx.RegExp = RegExp; ctx.String = String; ctx.Function = Function; 
  }
}extend(String, {
  
  isString: function isString(object) {
    /**
     * Determines whether the object provided is a string.
     *
     * @since 1.5.0
     * @param object The object to test
     * @example
     *  String.isString({}) // false
     *  String.isString('asd') // true
     * 
     * @returns bool
     */
    return typeof object === 'string' || object instanceof String;
  },
  
  UUID: function UUID() {
    /**
     * Creates a RFC 4122 compliant UUID. This implementation relies on Number.random(). Even so you can be assured that each generation is pretty much always going to be different.
     *
     * @since 1.2.0
     * @example
     *  String.UUID()
     *    // returns something like '89996AE3-6FBB-428299C78-670C095256631' 
     * 
     * @returns string
     */
    return Array.range(0, 35).map(function (i) {
      switch (i) {
        case 8:
        case 13:
        case 23: return '-';
        case 14: i = 4; break;
        case 19: i = (Number.random(0, 16).floor() & 0x3) | 0x8; break;
        default: i = Number.random(0, 16).floor(); break;
      }
      return '0123456789ABCDEF'.charAt(i);
    }).join(''); 
  }
});

extend(String.prototype, {
  
  repeat: function repeat(num) {
    /**
     * Repeats the value of the string a certain number of times.
     *
     * @since 1.5.1
     * @param [num=1] The number of times to repeat
     * @example
     *  'a'.repeat(5);
     *    // returns 'aaaaa' 
     * 
     * @returns string
     */
    var str = '';
    
    for (var i = 0, str = ''; i < (num || 1); i++)
      str += this;
      
    return str;
    
  },

  chars: function chars() {
    /**
     * Gets all the characters within the string and puts them in an array.
     *
     * @since 1.2.0
     * @example
     *  'abc'.chars();
     *    // returns ['a','b','c'] 
     * 
     * @returns array
     */
    for (var i = 0, arr = []; i < this.length; i++)
      arr.push(this.charAt(i));
      
    return arr;
    
  },
  
  count: function count(substr, mod) {
    /**
     * Counts the number of instances of a given sub string. You can also give some RegEx modifiers to determine what to look for. By default this operation is case-insensitive.
     *
     * @since 1.2.0
     * @param substr The sub-string or regular expression
     * @param [modifiers='gi'] A list of modifiers
     * @example
     *  'aBab'.count('ab')
     *    // returns 2
     *
     *  'aBab'.count('ab', 'g')
     *    // returns 1
     * 
     * @returns int
     */
    return this.match(RegExp(substr, mod || 'gi')).length;
    
  },
  
  insert: function insert(substr, pos) {
    /**
     * Inserts a substring at a given position within the string. Position defaults to 0 which will insert the string onto the beginning (opposite of concat).
     *
     * @since 1.2.0
     * @param substr The sub-string to insert
     * @param [position=0] The position to insert at
     * @example
     *  'ab'.insert('ab')
     *    // returns 'abab'
     *
     *  'ab'.insert('ab', 1)
     *    // returns 'aabb'
     * 
     * @returns string
     */
    return this.substr(0, pos || 0) + substr + this.substr(pos || 0);
    
  },
  
  remove: function remove(substr, modifiers) {
    /**
     * Removes a given string or regular expression from the string
     *
     * @since 1.2.0
     * @param substr The sub string or regex
     * @param [modifiers='gmi'] The regex modifiers
     * @example
     *  'abBc'.remove('b')
     *    // returns 'ac'
     *
     *  'abBc'.remove('b', 'g)
     *    // returns 'aBc'
     * 
     * @returns string
     */
    if ( ! (substr instanceof RegExp))
      substr = new RegExp(substr, modifiers || 'gmi');
    
    return this.replace(substr, '');
    
  },
  
  reverse: function reverse() {
    /**
     * Reverses the string's character order.
     *
     * @since 1.2.0
     * @example
     *  'abc'.reverse()
     *    // returns 'cba'
     * 
     * @returns string
     */
    return this.chars().reverse().join('');
    
  },
  
  ucfirst: function ucfirst() {
    /**
     * Converts the first character to an uppercase one.
     *
     * @since 1.2.0
     * @example
     *  'abc'.ucfirst()
     *    // returns 'Abc'
     * 
     * @returns string
     */
    return this.charAt(0).toUpperCase() + this.substr(1);
    
  },
  
  swapcase: function swapcase() {
    /**
     * Toggle's the case of each character within the string. Uppercase -> Lowercase, Lowercase -> Uppercase.
     *
     * @since 1.2.0
     * @example
     *  'aBc'.swapcase()
     *    // returns 'AbC'
     * 
     * @returns string
     */
    return this.chars().map(function (a) {
      return /[a-z]/.test(a) ? a.toUpperCase() : a.toLowerCase(); 
    }).join('');
    
  },
  
  rpad: function rpad(len, chars) {
    /**
     * Continues to add a set of characters to the end of the string until it reaches a certain length.
     *
     * @since 1.2.0
     * @param length The length to reach
     * @param chars What characters to pad
     * @example
     *  'a'.rpad(5)
     *    // returns 'a    '
     *
     *  'a'.rpad(5, '123')
     *    // returns 'a1231'
     * 
     * @returns string
     */
    len = Number(len);
    if (len < this.length) return this.valueOf();
    for (var str = this; str.length < len; str += (chars || ' '));
    return str.substr(0, len);
    
  },
  
  lpad: function lpad(len, chars) {
    /**
     * Continues to add a set of characters to the beginning of the string until it reaches a certain length.
     *
     * @since 1.2.0
     * @param length The length to reach
     * @param chars What characters to pad
     * @example
     *  'a'.lpad(5)
     *    // returns '    a'
     *
     *  'a'.lpad(5, '123')
     *    // returns '1321a'
     * 
     * @returns string
     */
    len = Number(len);
    if (len < this.length) return this.valueOf();
    chars = (chars || ' ').reverse();
    for (var str = this; str.length < len; str = (chars + str));
    return str.substr(str.length - len);
    
  },
  
  pad: function pad(len, chars) {
    /**
     * Continues to add a certain character until the string reaches a certain size. A negative size will perform lpad, a positive size will perform rpad.
     *
     * @since 1.3.0
     * @param length The length to reach
     * @param chars What characters to pad
     * @example
     *  'a'.pad(-5)
     *    // returns '    a'
     *
     *  'a'.pad(5)
     *    // returns 'a     '
     * 
     * @returns string
     */
    return this[len > 0 ? 'rpad' : 'lpad'](Math.abs(len), chars);
    
  },

  soundex: function soundex() {
    /**
     * Generates a soundex for the given string. A soundex is a letter followed by 3 numbers
     *
     * @since 1.2.0
     * @see http://en.wikipedia.org/wiki/Soundex
     * @example
     *  'Hello'.soundex()
     *    // returns 'H040'
     *
     *  'World'.soundex()
     *    // returns 'W064'
     *
     * @returns string
     */
    return this.substr(0,1).toUpperCase() + 
      this.toUpperCase().substr(1)
      .remove(/[^A-Z]/gi).trim()
      .replace(/DG/g, 'G')
      .replace(/GH/g, 'H')
      .replace(/GN|KN/g, 'N')
      .replace(/PH/g, 'F')
      .replace(/MP([STZ])/g, 'M$1')
      .replace(/^PS/g, 'S')
      .replace(/^PF/g, 'F')
      .replace(/MB/g, 'M')
      .replace(/TCH/g, 'CH')
      .replace(/[AEIOUHWY]/g, '0')
      .replace(/[BFPV]/g, '1')
      .replace(/[CGJKQSXZ]/g, '2')
      .replace(/[DT]/g, '3')
      .replace(/[L]/g, '4')
      .replace(/[MN]/g, '5')
      .replace(/[R]/g, '6')
      .replace(/(\w)\1+/g, '$1')
      .slice(0, 3).rpad(3, '0');

  },
  
  distance: function distance(c) {
    /**
     * Calculates the distance between 2 strings using Levenshtein's algorithm.
     *
     * @since 1.2.0
     * @param string The string to find the distance from
     * @see http://en.wikipedia.org/wiki/Levenshtein_distance
     * @example
     *  'hello'.distance('world');
     *  
     * @returns string
     */
    var s, l = (s = this.split("")).length, t = (c = c.split("")).length, i, j, m, n;
    if(!(l || t)) return Math.max(l, t);
    for(var a = [], i = l + 1; i; a[--i] = [i]);
    for(i = t + 1; a[0][--i] = i;);
    for(i = -1, m = s.length; ++i < m;)
      for(j = -1, n = c.length; ++j < n;)
        a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + 1, a[i + 1][j] + 1, a[i][j] + (s[i] != c[j]));
    return a[l][t];
        
  },
  
  soundex: function soundex() {
    /**
     * Generates a soundex for the given string. A soundex is a letter followed by 3 numbers
     *
     * @since 1.2.0
     * @see http://en.wikipedia.org/wiki/Soundex
     * @example
     *  'Hello'.soundex()
     *    // returns 'H040'
     *
     *  'World'.soundex()
     *    // returns 'W064'
     *
     * @returns string
     */
    return this.substr(0,1).toUpperCase() + 
      this.toUpperCase().substr(1)
      .remove(/[^A-Z]/gi).trim().replace(/DG/g, 'G').replace(/GH/g, 'H').replace(/GN|KN/g, 'N')
      .replace(/PH/g, 'F').replace(/MP([STZ])/g, 'M$1').replace(/^PS/g, 'S').replace(/^PF/g, 'F')
      .replace(/MB/g, 'M').replace(/TCH/g, 'CH').replace(/[AEIOUHWY]/g, '0').replace(/[BFPV]/g, '1')
      .replace(/[CGJKQSXZ]/g, '2').replace(/[DT]/g, '3').replace(/[L]/g, '4').replace(/[MN]/g, '5')
      .replace(/[R]/g, '6').replace(/(\w)\1+/g, '$1').rpad(3, '0');

  },
  
  chunk: function chunk(len) {
    /**
     * Splits the string up to a set of chunks of a certain length
     *
     * @since 1.5.0
     * @param length The lengths of each chunk
     * @example
     *  'HelloWorld'.chunk(3)
     *    // returns ['Hel', 'loW', 'orl', 'd'];
     *
     * @returns string
     */
    return this.chars().chunk(len).map(function (chars) {
      return chars.join('');
    });
  },
  
  btoa: function btoa() {
    /**
     * Encodes a string into Base64
     * 
     * @since 1.5.0
     * @example
     *  'Hello World'.btoa()
     *    // returns 'SGVsbG8gV29ybGQ='
     */
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', output = '', input = this.valueOf();
    for (i = 0; i < input.length; i += 3) {
      var c1 = input.charCodeAt(i), c2 = input.charCodeAt(i + 1), c3 = input.charCodeAt(i + 2);
      var e1 = c1 >> 2,
          e2 = ((c1 & 3) << 4) | (c2 >> 4),
          e3 = ((c2 & 15) << 2) | (c3 >> 6),
          e4 = c3 & 63;
          
      if (isNaN(c1))
        e3 = e4 = 64;
      else if (isNaN(c3))
        e4 = 64;
      
      output += key.charAt(e1) + key.charAt(e2) + key.charAt(e3) + key.charAt(e4);
    }
    
    return output;
  },
  
  atob: function atob() {
    /**
     * Decodes a string from Base64
     * 
     * @since 1.5.0
     * @example
     *  'SGVsbG8gV29ybGQ='.atob()
     *    // returns 'Hello World'
     */
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', output = '', input = this;
    return input.split("\n").map(function (line) {
      var output = '';
      for (i = 0; i < line.length; i += 4) {
        var e1 = key.indexOf(line.charAt(i)),
            e2 = key.indexOf(line.charAt(i + 1)),
            e3 = key.indexOf(line.charAt(i + 2)),
            e4 = key.indexOf(line.charAt(i + 3));

        var c1 = (e1 << 2) | (e2 >> 4),
            c2 = ((e2 & 15) << 4) | (e3 >> 2),
            c3 = ((e3 & 3) << 6) | e4;

        output += String.fromCharCode(c1);
        if (e3 != 64) output += String.fromCharCode(c2);
        if (e4 != 64) output += String.fromCharCode(c3);
      }
      return output;
    }).join('');
  },
  
  sprintf: function sprintf(c) {
    /**
     * The classic sprintf function as implemented with currently a limited number of supported tags: b,c,d,f,o,s,u,x,X
     *
     * @since 1.3.0
     * @param string The string to find the distance from
     * @see http://en.wikipedia.org/wiki/Printf#Format_placeholders
     * @example
     *  '%01.2f'.sprintf(12.1)
     *    // returns '12.10'
     *
     *  'Hello %s, %s'.sprintf('world', 'How are you?')
     *    // returns 'Hello world, How are you?'
     * 
     * @returns string
     */
    var vals = arguments, regex = /%%|%(?:(\d+)[\$#])?([+-])?('.|0| )?(\d*)(?:\.(\d+))?([bcdfosuxX])/g;
    var index = 0;
    
    return this.replace(regex, function (substr, flags, align, padding, width, precision, type) {
      
      if (substr == '%%') return '%';
      
      flags = flags || '',
      align = align || '',
      padding = (padding || '').slice(-1) || ' ',
      width = width || '',
      precision = precision || '';
      
      val = vals[+flags ? flags - 1 : index]; index++;
      
      if (type.match(/[duobxXf]{1}/)) val = Number(val);
      else val = String(val);
            
      switch (type) {
        
        case 'd':
        case 'u': return val.dec(align + width, padding);
        case 'o': return val.oct(align + width, padding);
        case 'b': return val.bin(align + width, padding);
        case 'x': return val.hexl(align + width, padding);
        case 'X': return val.hex(align + width, padding);
        case 's': return val.pad(align + width, padding);
        case 'c': return String.fromCharCode(val).pad(align + width, padding);
        case 'f': {
          
          if (precision) val = val.toFixed(precision);
          else if (width) val = val.toExponential(width);
          else val = val.toExponential();
          
          align = align == '-' ? '+' : '-';
          
          return val.toString().pad(align + width, padding);
        }
      }
    });  
  }
});

/**
 * ECMA5 Polyfills
 */
if ( ! String.prototype.trim)  {
  extend(String.prototype, 'trim', function trim() {
    return this.trimRight().trimLeft();
  });
}

if ( ! String.prototype.trimRight)  {
  extend(String.prototype, 'trimRight', function trimRight() {
    return this.remove(/^\s\s*/);
  });
}

if ( ! String.prototype.trimLeft)  {
  extend(String.prototype, 'trimLeft', function trimLeft() {
    return this.remove(/\s\s*$/);
  });
}})();