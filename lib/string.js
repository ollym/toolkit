extend(String, {
  
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
}