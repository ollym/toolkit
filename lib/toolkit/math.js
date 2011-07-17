
/**
 * Random number between two values.
 *
 * @param start A number to start from
 * @param end A number to go to
 * 
 * @return number
 */
Math.random = function(start, end) {
	return (start = start || 0) + (((end || 1) - start) * this());
}.bind(Math.random);