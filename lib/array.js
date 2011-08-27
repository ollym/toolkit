/**
 * Creates an array containing a list of numbers in the range
 *
 */
Array.range = function(start, stop, step) {
    
  if (stop === undefined) {
    stop = start;
    start = 1;
  }
  
  var arr = [];
  
  for (var i = start; i <= stop; i += (step || 1)) {
    arr.push(i);
  }
  
  return arr;
}

/************************/
/* Prototype Extensions */
/************************/

Object.defineProperties(Array.prototype, {
  
  /**
   * Swaps two values over at a given index
   *
   * @param index1 The index of the first item to swap
   * @param index2 The index of the value to swap it with
   * @return void
   */
  swap: { value: function(index1, index2) {
    
    var value = this[index1];

  	this[index1] = this[index2];
  	this[index2] = value;
  	
  	return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  
  /**
   * Determines whether the array contains a specific value
   *
   * @param index1 The value to look for within the array
   * @return bool
   */
  contains: { value: function(value) {
    
    args = Object.values(arguments);
    
    return args.every(function(arg) { 
      return !! ~ this.indexOf(value);
    }.bind(this));
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Removes one or more values from the current array.
   *
   * @param index1 The value to look for within the array
   * @return bool
   */
  remove: { value: function(/* val1, val2, ... */) {
    
    args = Object.values(arguments);
      
    args.forEach(function(arg) {
      if (this.contains(arg))
        this.splice(this.indexOf(arg), 1);
    }.bind(this));
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Shuffles the entire array into a random order. Ref: Fisher and Yates' Algorithm
   *
   * @return array
   */
  shuffle: { value: function(value) {
    
    var arr = this.clone();
  
    for (var index = 0; index < arr.length - 1; index++) {
      arr.swap(index, Math.round(Math.random(index, arr.length - 1)));
    }
        
  	return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  clone: { value: function() {
    
    return this.slice();
    
  }, writable: true, enumerable: false, configurable: true  },
  
  /**
   * Gets the intersection with 1 or more array.
   *
   * @return array
   */
  intersect: { value: function(arr1, arr2, _) {
    
    var args = Object.values(arguments);

  	return this.filter(function(val) {
  		return args.every(function(arg) {
  			return arg.contains(val);
  		});
  	});
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Gets the different values from 1 or more other array.
   *
   * @return array
   */
  diff: { value: function(/* arr1, arr2, _ */) {
    
    var vals = Object.values(arguments).concat([this]).flatten(1);

    return vals.filter(function(a) {
      return vals.indexOf(a) == vals.lastIndexOf(a);
    });

  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Splits an array down into smaller chunks.
   *
   * @return array
   */
  chunk: { value: function(size) {
    
  	for (var arr = []; this.length > 0; arr.push(this.splice(0, size)));
  	return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Returns all the unique values within the array.
   *
   * @return array
   */
  unique: { value: function() {
    
  	return this.filter(function(a, idx) {
  	  return this.indexOf(a) == idx;
  	}.bind(this));
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * A forEach compatable alternative that allows for return breaks.
   *
   * @return mixed
   */
  each: { value: function(callback) {
    
  	var idx, result;
  	for (idx in this)
  		if ((result = callback(this[idx], idx, this)) !== undefined)
  			return result;
    
  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Flattens a multi-dimentional array into a 1-dimentional array.
   *
   * @return array
   */
   flatten: { value: function(level) {
     
     if (level === undefined) level = -1;

   	 return this.reduce(function(a,b) {
       return a.concat((Array.isArray(b) && level != 0) ? b.flatten(level - 1) : [b]);
     }, []);

   }, writable: true, enumerable: false, configurable: true },

  
  /**
   * Sums all the values within the array.
   *
   * @return int
   */
  sum: { value: function() {

  	return this.reduce(function(a, b) {
   		return a + b;
   	});

  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Sums all the values within the array.
   *
   * @return int
   */
  product: { value: function() {

  	return this.reduce(function(a, b) {
  		return a * b;
  	});

  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Gets the top n items in the array.
   *
   * @return array
   */
  first: { value: function(num) {

  	return this.slice(0, num || 1);

  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Gets the last n items in the array.
   *
   * @return array
   */
  last: { value: function(num) {

  	return this.slice(this.length - (num || 1));

  }, writable: true, enumerable: false, configurable: true },
  
  /**
   * Removes all elements which when casted to boolean return false.
   *
   * @return array
   */
  clean: { value: function(num) {

  	return this.filter(function(val) {
      return !! val;
    });

  }, writable: true, enumerable: false, configurable: true },
  
});