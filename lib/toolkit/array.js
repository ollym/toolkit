/**
 * Swaps two values over at a given index
 *
 * @param index1 The index of the first item to swap
 * @param index2 The index of the value to swap it with
 * @return void
 */
Array.prototype.swap = function(index1, index2) {
	
	var value = this[index1];
	
	this[index1] = this[index2];
	this[index2] = value;
}

/**
 * Determines whether the array contains a specific value
 *
 * @param index1 The value to look for within the array
 * @return bool
 */
Array.prototype.contains = function(value) {
	return !! ~ this.indexOf(value);
}

/**
 * Shuffles the entire array into a random order.
 *
 * @return array
 */
Array.prototype.shuffle = function() {
	
	this.forEach(function(value, index, arr) {
		arr.swap(index, Math.round(Math.random(index, this.length - 1)));
	});
	
	return this;
}

/**
 * Gets the intersection with 1 or more array.
 *
 * @return array
 */
Array.prototype.intersect = function(arr1, arr2, _) {
		
	var args = Array.prototype.slice.call(arguments);
	
	return this.filter(function(val) {
		return ! args.some(function(arg) {
			return ! arg.contains(val);
		});
	});
}

/**
 * Gets the different values from 1 or more other array.
 *
 * @return array
 */
Array.prototype.diff = function(arr1, arr2, _) {
	
	var args = Array.prototype.slice.call(arguments);
	
	return this.filter(function(val) {
		return args.some(function(arg) {
			return ! arg.contains(val);
		});
	});
}

/**
 * Splits an array down into smaller chunks.
 *
 * @return array
 */
Array.prototype.chunk = function(size) {
	for (var arr = []; this.length > 0; arr.push(this.splice(0, size)));
	return arr;
}

/**
 * Returns all the unique values within the array.
 *
 * @return array
 */
Array.prototype.unique = function() {
	
	var arr = this.reverse().filter(function(val, i, arr) {
		return arr.slice(i + 1).contains(val);
	});
	
	return arr.reverse();
}