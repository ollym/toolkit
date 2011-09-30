extend(Array, {
  
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

  });