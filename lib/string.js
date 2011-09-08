Object.defineProperties(String, {
  
  UUID: { value: function() {
    /**
     * Creates a RFC 4122 compliant UUID. This implementation relies on Math.random(). Even so you can be assured that each generation is pretty much always going to be different.
     *
     * @since 1.2.0
     * @example
     *  String.uuid()
     *    // returns something like '89996AE3-6FBB-428299C78-670C095256631' 
     * 
     * @returns string
     */
    return Array.range(0, 35).map(function(i) {
      switch (i) {
        case 8:
        case 13:
        case 23: return '-';
        case 14: i = 4; break;
        case 19: i = (Math.random(0, 16).floor() & 0x3) | 0x8; break;
        default: i = Math.random(0, 16).floor(); break;
      }
      return '0123456789ABCDEF'[i];
    }).join('');
    
  }, writable: true, enumerable: false, configurable: true },
  
});


Object.defineProperties(String.prototype, {

  chars: { value: function(obj) {
    /**
     * Gets all the enumerable values within an object.
     *
     * @since 1.2.0
     * @param object
     * @example
     *  Object.values({1:2,3:4});
     *    // returns [2,4] 
     * 
     * @returns array
     */
    for (var i = 0, arr = []; i < this.length; i++)
      arr.push(this.charAt(i));
      
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  count: { value: function(substr, mod) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  insert: { value: function(substr, pos) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  remove: { value: function(substr) {
    /**
     * Removes a given string or regular expression from the string
     *
     * @since 1.2.0
     * @param substr The sub string or regex
     * @example
     *  'abbc'.remove('b')
     *    // returns 'ac'
     * 
     * @returns string
     */
    return this.replace(substr, '');
    
  }, writable: true, enumerable: false, configurable: true },
  
  reverse: { value: function() {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  ucfirst: { value: function() {
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
    return this[0].toUpperCase() + this.substr(1);
    
  }, writable: true, enumerable: false, configurable: true },
  
  swapcase: { value: function() {
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
    return this.chars().map(function(a) {
      return /[a-z]/.test(a) ? a.toUpperCase() : a.toLowerCase(); 
    }).join('');
    
  }, writable: true, enumerable: false, configurable: true },
  
  rpad: { value: function(len, chars) {
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
    for (var str = this; str.length < len; str += (chars || ' '));
    return str.substr(0, len);
    
  }, writable: true, enumerable: false, configurable: true },
  
  lpad: { value: function(len, chars) {
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
     *  'a'.rpad(5, '123')
     *    // returns '1321a'
     * 
     * @returns string
     */
    chars = (chars || ' ').reverse();
    for (var str = this; str.length < len; str = (chars + str));
    return str.substr(str.length - len);
    
  }, writable: true, enumerable: false, configurable: true },

  soundex: { value: function() {
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
      .rpad(3, '0');

  }, writable: true, enumerable: false, configurable: true },
  
  distance: { value: function(c) {
    /**
     * Calculates the distance between 2 strings using Levenshtein's algorithm.
     *
     * @since 1.2.0
     * @param string The string to find the distance from
     * @see http://en.wikipedia.org/wiki/Levenshtein_distance
     * @example
     *  'aBc'.swapcase()
     *    // returns 'AbC'
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
        
  }, writable: true, enumerable: false, configurable: true }
  
});