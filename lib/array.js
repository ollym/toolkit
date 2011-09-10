/**
 * Creates an array containing a list of numbers in the range
 */
Object.defineProperties(Array, {
  
  range: { value: function range(start, stop, step) {
    /**
     * Constructs an array containing a number of integers specified by the parameters
     * 
     * @since 1.0.0
     * @param start The number to start at
     * @param stop The number to stop at
     * @param step How many to increment at a time
     * @example
     *  Array.range(5, 12, 2)
     *    // returns [5,7,9,11]
     *
     *  Array.range(5, 8)
     *    // returns [5,6,7,8]
     * 
     * @returns array
     */
    if (stop === undefined) {
      stop = start;
      start = 1;
    }

    var arr = [];

    for (var i = start; i <= stop; i += (step || 1)) {
      arr.push(i);
    }

    return arr;
    
  }, writable: true, enumerable: false, configurable: true }
  
});

Object.defineProperties(Array.prototype, {
  
  swap: { value: function swap(index1, index2) {
    /**
     * Swaps two values within the array given their indexes.
     *
     * @since 1.0.0
     * @param index1 The index of the first item to swap
     * @param index2 The index of the value to swap it with
     * @example
     *  var arr = [5, 10, 15];
     *  arr.swap(0,2);
     *  arr = [15, 10, 5]
     * 
     * @returns self
     */
    var value = this[index1];

    this[index1] = this[index2];
    this[index2] = value;
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  contains: { value: function contains(values) {
    /**
     * Checks whether the array obtains a certain value. This uses the internal indexOf() method which enforces strict equality (===).
     *
     * @since 1.0.0
     * @param *values All the values
     * @example
     *  var arr = [5, 10, 15];
     *  arr.swap(0,2);
     *  arr = [15, 10, 5]
     * 
     * @returns bool
     */
    args = Object.values(arguments);
    
    return args.every(function(arg) { 
      return !! ~ this.indexOf(arg);
    }.bind(this));
    
  }, writable: true, enumerable: false, configurable: true },
  
  remove: { value: function remove() {
    /**
     * Removes all instances of the given values from the array. Remove uses the indexOf method which enforces strict equality (===).
     *
     * @since 1.0.0
     * @param *values All the values
     * @example
     *  var arr = [5, 2, 5, 7];
     *  arr.remove(5, 2); // [7]
     * 
     * @returns self
     */
    args = Object.values(arguments);
      
    args.forEach(function(arg) {
      if (this.contains(arg))
        this.splice(this.indexOf(arg), 1);
    }.bind(this));
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  shuffle: { value: function shuffle() {
    /**
     * Re-orders all values within the array into a random order. The method is simple and relies on Math.random() to generate random numbers which is automatically seeded.
     *
     * @since 1.0.0
     * @example
     *  var arr = ['a','b','c'].shuffle();
     *    // returns something like b,a,c
     *
     * @returns array
     */
    var arr = this.clone();
  
    for (var index = 0; index < arr.length - 1; index++) {
      arr.swap(index, Math.random(index, arr.length - 1).round());
    }
        
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  shuffle$: { value: function shuffle$() {
    /**
     * The self-modification variant of Array.shuffle.
     *
     * @since 1.3.0
     * @example
     *  var arr = ['a','b','c'];
     *  arr.shuffle$();
     *    // arr will be something like b,a,c
     *
     * @returns self
     */
    for (var index = 0; index < this.length - 1; index++) {
      this.swap(index, Math.random(index, this.length - 1).round());
    }
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  clone: { value: function clone() {
    /**
     * Clones the array by copying all the enumerable values into a new one. Any non-enumerable properties you've defined using Object.defineProperties or alike will be lost. If you don't want that, use Object.clone() instead.
     *
     * @since 1.0.0
     * @example
     *  var a = [1,2,3], b = a.clone();
     *  a == b // false
     *  a.join(',') == b.join(',') // true
     *
     * @returns array
     */
    return this.slice();
    
  }, writable: true, enumerable: false, configurable: true  },
  
  intersect: { value: function intersect() {
    /**
     * Finds the intersection between one or more different arrays. This can be useful so to use the array as a set. Equivalent to the ampersand (&) operator. Equality checks are strict - again use the indexOf method.
     *
     * @since 1.0.0
     * @param *values The arrays to intersect with
     * @example
     *  [1,2,3].intersect([2,3,4], [3,4,5]);
     *    // returns [3]
     *
     * @returns array
     */
    var args = Object.values(arguments);

    return this.filter(function(val) {
      return args.every(function(arg) {
        return arg.contains(val);
      });
    });
    
  }, writable: true, enumerable: false, configurable: true },

  diff: { value: function diff() {
    /**
     * Finds values which are unique to only one array from all that are given as parameters (including the current instance). Regarded as the opposite as intersect. Again equality tests are strict.
     *
     * @since 1.0.0
     * @param *arrays The arrays to differentiate with
     * @example
     *  [1,2,3].diff([2,3,4], [3,4,5]);
     *    // returns [1,5]
     *
     * @returns array
     */
    var vals = Object.values(arguments).concat([this]).flatten(1);

    return vals.filter(function(a) {
      return vals.indexOf(a) == vals.lastIndexOf(a);
    });

  }, writable: true, enumerable: false, configurable: true },
  
  union: { value: function union() {
    /**
     * Creates an array with distinct values from each of the arrays given as parameters.
     *
     * @since 1.3.0
     * @param *arrays The arrays to union
     * @example
     *  [1,2,3].union([3,4,5], [5,6,7]);
     *    // returns [1,2,3,4,5,6,7]
     *
     * @returns array
     */
    return this.concat.apply(this, Object.values(arguments)).unique();

  }, writable: true, enumerable: false, configurable: true },
  
  chunk: { value: function chunk(size) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  chunk$: { value: function chunk$(size) {
    /**
     * The self-modification version of Array.chunk.
     *
     * @since 1.3.0
     * @param size The size of the array chunks
     * @example
     *  var a = [1,2,3,4,5,6]
     *  a.chunk$(2);
     *  // a = [[1,2],[3,4],[5,6]]
     *
     * @returns self
     */
    for (var i = 0, length = this.length / size; i < length; i++) {
      this.splice(i, 0, this.splice(i, size));
    }
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  unique: { value: function unique() {
    /**
     * Returns a list of unique items within the array. i.e. If there are are 2 identical values, one will be removed. This again uses indexOf() which performs strict equality checks.
     *
     * @since 1.0.0
     * @example
     *  [1,2,2,3,4,3].unqiue()
     *    // returns [1,2,3,4]
     *
     * @returns array
     */
    return this.filter(function(a, idx) {
      return this.indexOf(a) == idx;
    }.bind(this));
    
  }, writable: true, enumerable: false, configurable: true },
  
  each: { value: function each(callback) {
    /**
     * Unlike forEach(), each() allows the loop to be broken and a value returned. The callback is called for each item and given (value, index, self) as its parameters. If it returns a value other than undefined the loop will be stopped and that value returned.
     *
     * @since 1.0.0
     * @example
     *  var a = [1,2,3,4,5,6].each(function(val, idx) {
     *    if (val == 2) return idx;
     *  });
     *  // a = 1;
     *
     * @returns mixed
     */
    var idx, result;
    for (idx in this)
      if ((result = callback.call(null, this[idx], idx, this)) !== undefined)
        return result;
    
  }, writable: true, enumerable: false, configurable: true },
  
   flatten: { value: function flatten(level) {
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
     if (level === undefined) level = -1;
     else if (level == 0) return this.clone();

      return this.reduce(function(a,b) {
       return a.concat((Array.isArray(b) && level != 0) ? b.flatten(level - 1) : [b]);
     }, []);

   }, writable: true, enumerable: false, configurable: true },
   
    flatten$: { value: function flatten$(level) {
       /**
        * Self-modification version of Array.flatten.
        *
        * @since 1.3.0
        * @param level How deep to go
        * @example
        *  var a = [[1,2],[[3]],4,5];
        *  a.flatten$();
        *   // a = [1,2,3,4,5]
        *
        * @returns self
        */
      if (level === undefined) level = -1;
      
      for (var i = 0, length = this.length; i < length; i++) {
        if (Array.isArray(this[i]) && level != 0)
          this.splice.apply(this, [i, 1].concat(this[i].flatten(level - 1)));
      }
      
      return this;

     }, writable: true, enumerable: false, configurable: true },

  sum: { value: function sum() {
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
    return this.reduce(function(a, b) {
       return Number(a) + Number(b);
     });

  }, writable: true, enumerable: false, configurable: true },
  
  product: { value: function product() {
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
    return this.reduce(function(a, b) {
      return Number(a) * Number(b);
    });

  }, writable: true, enumerable: false, configurable: true },

  first: { value: function first(num) {
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

  }, writable: true, enumerable: false, configurable: true },
  
  last: { value: function last(num) {
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

  }, writable: true, enumerable: false, configurable: true },
  
  clean: { value: function clean() {
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
    return this.filter(function(val) {
      return !! val;
    });

  }, writable: true, enumerable: false, configurable: true },
  
  clean$: { value: function clean$() {
    /**
     * Self modification version of Array.clean.
     *
     * @since 1.3.0
     * @example
     *  var a = [1,null,2,0];
     *  a.clean()
     *    // returns [2,3]
     *
     * @returns self
     */
    return this.filter$(function(val) {
      return !! val;
    });
    
    return this;

  }, writable: true, enumerable: false, configurable: true },
  
  filter$: { value: function filter$(callback, scope) {
    /**
     * Self modification version of Array.filter.
     *
     * @since 1.3.0
     * @param callback Will be called on each element. The value returned will become the new value.
     * @param scope The value of this in the callback.
     * @example
     *  var a = [1,2,3,4,5,6];
     *  a.filter(function(n) { return n.even });
     *    // a = [2,4,6]
     *
     * @returns self
     */
    for (var i = 0; i < this.length; i++)
      if ( ! callback.call(scope, this[i], i, this))
        this.splice(i, 1) && i--;
        
    return this;

  }, writable: true, enumerable: false, configurable: true },
  
  map$: { value: function map$(callback, scope) {
    /**
     * Self modification version of Array.map.
     *
     * @since 1.3.0
     * @param callback Will be called on each element. The value returned will become the new value.
     * @param scope The value of this in the callback.
     * @example
     *  var a = [1,2,3];
     *  a.map(function(n) { return n * n });
     *    // a = [1,4,9]
     *
     * @returns self
     */
    for (var i = 0; i < this.length; i++)
      this[i] = callback.call(scope, this[i], i, this);
        
    return this;

  }, writable: true, enumerable: false, configurable: true },
  
  invoke: { value: function invoke(callback) {
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
    return this.map(function(val) {
      return val[callback].apply(val, Array.prototype.slice.call(this, 1));
    }, arguments);
    
  }, writable: true, enumerable: false, configurable: true },
  
  invoke$: { value: function invoke$(callback) {
    /**
     * The self modification version of Array#invoke
     *
     * @since 1.3.0
     * @param property The name of the property within each object to call.
     * @param *params Any params to pass to the function.
     * @example
     *  var a = [1.142,2.321,3.754];
     *  a.invoke('round', 2)
     *    // a = [1.14,2.32,3.75]
     *
     * @returns self
     */
    return this.map$(function(val) {
      return val[callback].apply(val, Array.prototype.slice.call(this, 1));
    }, arguments);
    
  }, writable: true, enumerable: false, configurable: true },
  
  pluck: { value: function pluck(prop) {
    /**
     * Gets a property from each of the objects within the array and returns it in a seperate array.
     *
     * @since 1.3.0
     * @param property The name of the property to pluck.
     * @example
     *  ['hello','world','this','is','nice'].pluck('length');
     *    // returns [5, 5, 4, 2, 4]
     *
     * @returns array
     */
    return this.map(function(val) {
      return val[prop];
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  pluck$: { value: function pluck$(prop) {
    /**
     * The self-modification version of Array#pluck
     *
     * @since 1.3.0
     * @param property The name of the property to pluck.
     * @example
     *  var a = ['hello','world','this','is','nice'];
     *  a.pluck('length');
     *    // a = [5, 5, 4, 2, 4]
     *
     * @returns self
     */
    return this.map$(function(val) {
      return val[prop];
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  grep: { value: function grep(regex) {
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
    return this.filter(function(val) {
      return !! val.match(regex);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  grep$: { value: function grep$(regex) {
    /**
     * Self modification version of Array#grep
     *
     * @since 1.3.0
     * @param regex The regular expression to match
     * @example
     *  var a = ['hello','world','this','is','cool'];
     *  a.grep(/(.)\1/); // Words with letters that repeat
     *    // a = ['hello', 'cool']
     *
     * @returns self
     */
    return this.filter$(function(val) {
      return !! val.match(regex);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  sort$: { value: function sort$(sort) {
    /**
     * Self modification version of Array#sort
     *
     * @since 1.3.0
     * @param callback The comparison function
     * @example
     *  var a = ['d','b','a','c','e'];
     *  a.sort$();
     *    // a = ['a','b','c','d','e']
     *
     * @returns self
     */
    var sorted = this.sort(sort);
    sorted.forEach(function(val, i) {
      this[i] = val;
    }, this);
    return this;

  }, writable: true, enumerable: false, configurable: true },
  
  sortBy: { value: function sortBy(cmp, sort) {
    /**
     * Sorts an array based on a value returned by a mapping function called on each element in the array.
     *
     * @since 1.3.0
     * @param mapping The mapping callback to apply to each value.
     * @param comparison The comparison callback used in the sort afterwords.
     * @example
     *  ['hello','world','this','is','nice'].sortBy(function(s) { return s.length; }); // Sort by length
     *    // returns ['is', 'this', 'nice', 'hello', 'world']
     *
     *  ['hello','world','this','is','nice'].sortBy('length');
     *    // Same as above
     *
     * @returns array
     */
    if (cmp === undefined)
      return this.sort(sort);
      
    if (sort === undefined)
      sort = function(a,b) { return a > b};
      
    // Get the values we intend to sort
    var arr = this[typeof cmp === 'function' ? 'map' : 'pluck'](cmp);
    
    arr = arr.map(function(val, i) {
      return { key: i, val: val };
    });

    return arr.sort(function(a,b) {
      return sort.call(null, a.val, b.val);
    }).map(function(val) {
      return this[val.key];
    }, this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  sortBy$: { value: function sortBy(cmp, sort) {
    /**
     * The self-modifying version of sortBy
     *
     * @since 1.3.0
     * @param mapping The mapping callback to apply to each value.
     * @param comparison The comparison callback used in the sort afterwords.
     * @example
     *  var a = ['hello','world','this','is','nice']
     *  a.sortBy('length');
     *    // a = ['is', 'this', 'nice', 'hello', 'world']
     *
     * @returns self
     */
    this.sortBy(cmp, sort).forEach(function(v, i) {
      this[i] = v;
    }, this);
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  fetch: { value: function fetch(order) {
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
     *  [1,2,3,4,5,6].fetch(function(n,i) { return n % 6; });
     *    // returns [6,1,2,3,4,5]
     *
     * @returns array
     */
    if (typeof order == 'function')
      order = this.map(order);
    
    if ( ! Array.isArray(order))
      order = Object.values(arguments);
      
    var arr = [];
    
    order.forEach(function(o, i) {
      arr[o] = this[i];
    }, this);
    
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
});