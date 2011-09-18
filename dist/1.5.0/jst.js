/*  
 *  ddr-ECMA5 JavaScript library, version 1.2.2RC
 *  (c) 2010 David de Rosier
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Revision: 26
 *  Date: 04.08.2011
 */
(function(global,undefined){"use strict";var __features={STRING_INDEX_ENUMERABLE:"abc".propertyIsEnumerable("1"),ACCESSORS:Object.prototype.__defineGetter__&&Object.prototype.__defineSetter__,DOM:typeof window==='object'&&typeof document==='object'};var __propertyIsEnumerable=function(obj,property){if(obj.propertyIsEnumerable){return obj.propertyIsEnumerable(property)}for(var key in obj){if(key===property&&(obj.hasOwnProperty?obj.hasOwnProperty(property):true)){return true}}return false};Function.prototype.bind||(Function.prototype.bind=function(ctx){if(typeof this!=='function')throw new TypeError("'this' is not a function");var fn=this,args=$AP.slice.call(arguments,1);return function(){return fn.apply(ctx,args.concat(Array.prototype.slice.call(arguments)))}});String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s\s*/,'').replace(/\s\s*$/,'')});Array.isArray||(Array.isArray=function(obj){return Object.prototype.toString.call(obj)==="[object Array]"||(obj instanceof Array)});var $AP=Array.prototype;$AP.indexOf||($AP.indexOf=function(searchElement){var len=this.length,i=+arguments[1]||0;if(len===0||isNaN(i)||i>=len)return-1;if(i<0){i=len+i;i<0&&(i=0)}for(;i<len;++i){if(this.hasOwnProperty(String(i))&&this[i]===searchElement)return i}return-1});$AP.lastIndexOf||($AP.lastIndexOf=function(searchElement){var len=this.length,i=+arguments[1]||len-1;if(len===0||isNaN(i))return-1;if(i<0){i=len+i}else if(i>=len){i=len-1}for(;i>=0;--i){if(this.hasOwnProperty(String(i))&&this[i]===searchElement)return i}return-1});$AP.every||($AP.every=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var thisArg=arguments[1];for(var i=0,len=this.length;i<len;++i){if(this.hasOwnProperty(String(i))){if(!callback.call(thisArg,this[i],i,this))return false}}return true});$AP.some||($AP.some=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var thisArg=arguments[1];for(var i=0,len=this.length;i<len;++i){if(this.hasOwnProperty(String(i))){if(callback.call(thisArg,this[i],i,this))return true}}return false});$AP.forEach||($AP.forEach=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var thisArg=arguments[1];for(var i=0,len=this.length;i<len;++i){if(this.hasOwnProperty(String(i))){callback.call(thisArg,this[i],i,this)}}});$AP.map||($AP.map=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var thisArg=arguments[1],len=this.length,results=new Array(len);for(var i=0;i<len;++i){if(this.hasOwnProperty(String(i))){results[i]=callback.call(thisArg,this[i],i,this)}}return results});$AP.filter||($AP.filter=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var thisArg=arguments[1],len=this.length,results=[];for(var i=0;i<len;++i){if(this.hasOwnProperty(String(i))){callback.call(thisArg,this[i],i,this)&&results.push(this[i])}}return results});$AP.reduce||($AP.reduce=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var len=this.length;if(len===0&&arguments.length<2)throw new TypeError("reduce of empty array with no initial value");var initIdx=-1;if(arguments.length<2){if((initIdx=__firstIndex(this))===-1)throw new TypeError("reduce of empty array with no initial value");}var val=arguments.length>1?arguments[1]:this[initIdx];for(var i=initIdx+1;i<len;++i){if(this.hasOwnProperty(String(i))){val=callback(val,this[i],i,this)}}return val});$AP.reduceRight||($AP.reduceRight=function(callback){if(!__isCallable(callback))throw new TypeError(callback+" is not a callable object");var len=this.length;if(len===0&&arguments.length<2)throw new TypeError("reduce of empty array with no initial value");var initIdx=len;if(arguments.length<2){for(var k=len-1;k>=0;--k){if(this.hasOwnProperty(String(k))){initIdx=k;break}}if(initIdx===len)throw new TypeError("reduce of empty array with no initial value");}var val=arguments.length>1?arguments[1]:this[initIdx];for(var i=initIdx-1;i>=0;--i){if(this.hasOwnProperty(String(i))){val=callback(val,this[i],i,this)}}return val});Date.now||(Date.now=function(){return+new Date});Date.prototype.toISOString||(Date.prototype.toISOString=(function(){var str=function(n,l){var str=String(n),len=l||2;while(str.length<len)str='0'+str;return str};return function(){return isFinite(this.getTime())?String(this.getUTCFullYear()).concat('-',str(this.getUTCMonth()+1),"-",str(this.getUTCDate()),"T",str(this.getUTCHours()),":",str(this.getUTCMinutes()),":",str(this.getUTCSeconds()),".",str(this.getUTCMilliseconds(),3),"Z"):'Invalid Date'}})());Date.prototype.toJSON||(Date.prototype.toJSON=function(key){if(!isFinite(this))return null;if(!this.toISOString||typeof this.toISOString!=='function')throw new TypeError("Date.prototype.toJSON called on incompatible "+(typeof this));return this.toISOString()});if(!Object.getPrototypeOf){if("".__proto__){Object.getPrototypeOf=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");return obj.__proto__}}else{Object.getPrototypeOf=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");return obj.constructor?obj.constructor.prototype:null}}}Object.create||(Object.create=(function(){var __TmpConstructor=function(){};return function(proto,properties){if(!__isObject(proto))throw new TypeError(proto+" is not an object");__TmpConstructor.prototype=proto;var obj=new __TmpConstructor();properties&&Object.defineProperties(obj,properties);return obj}})());Object.isSealed||(Object.isSealed=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");return false});Object.isFrozen||(Object.isFrozen=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");return false});Object.isExtensible||(Object.isExtensible=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");return true});Object.getOwnPropertyDescriptor||(Object.getOwnPropertyDescriptor=(function(){var __NUMBER_CONSTS=['MAX_VALUE','MIN_VALUE','NaN','POSITIVE_INFINITY','NEGATIVE_INFINITY'],__MATH_CONSTS=['PI','E','LN2','LOG2E','LOG10E','SQRT1_2','SQRT2'];return function(obj,pname){if(!__isObject(obj))throw new TypeError(obj+" is not an object");if(!(pname in obj))return;var editable=true,configurable=true;if((obj===Number&&__NUMBER_CONSTS.indexOf(pname)>=0)||(obj===Math&&__MATH_CONSTS.indexOf(pname)>=0)||(pname=='length'&&(obj===String.prototype||__isString(obj)||obj===Function.prototype||obj instanceof Function))){editable=false;configurable=false}else if(pname=='length'&&(obj===Array.prototype||Array.isArray(obj))){configurable=false}return{writable:editable,enumerable:__propertyIsEnumerable(obj,pname),configurable:configurable,value:obj[pname]}}})());(!Object.defineProperty||!Object.defineProperties)&&(function(){var __applyDefaults=function(desc,defaultValue,value){if(desc.hasOwnProperty("get")||desc.hasOwnProperty("set")){throw new TypeError("Getters and setters are not supported by this ECMAScript engine");}else{desc.writable=desc.hasOwnProperty('writable')?desc.writable:defaultValue;desc.value=desc.hasOwnProperty('value')?desc.value:value}desc.enumerable=desc.hasOwnProperty('enumerable')?desc.enumerable:defaultValue;desc.configurable=desc.hasOwnProperty('configurable')?desc.configurable:defaultValue;var t=null;if((!desc[t="configurable"])||(!desc[t="enumerable"])||(!desc[t="writable"])){throw new TypeError("Property '".concat(t,"' cannot be set to false in this version of ECMAScript engine"));}return desc};if(!Object.defineProperty){Object.defineProperty=function(obj,property,descriptor){if(!__isObject(obj))throw new TypeError(obj+" is not an object");var pname=String(property);var desc=__toPropertyDescriptor(descriptor);desc=__applyDefaults(desc,obj.hasOwnProperty(pname),obj[pname]);obj[pname]=desc.value;return obj};Object.defineProperty.DDRECMA5=true}if(!Object.defineProperties){Object.defineProperties=function(obj,properties){if(!__isObject(obj))throw new TypeError(obj+" is not an object");var properties=Object(properties);var descriptors={};for(var key in properties){if(properties.hasOwnProperty(key)){var desc=__toPropertyDescriptor(properties[key]);descriptors[key]=__applyDefaults(desc,obj.hasOwnProperty(key),obj[key])}}for(key in descriptors){if(properties.hasOwnProperty(key)){obj[key]=descriptors[key].value}}return obj};Object.defineProperties.DDRECMA5=true}})();Object.keys||(Object.keys=function(obj){if(!__isObject(obj))throw new TypeError(obj+" is not an object");var results=[];for(var key in obj){(obj.hasOwnProperty?obj.hasOwnProperty(key):key in obj)&&results.push(key)}if(__isString(obj)&&!__features.STRING_INDEX_ENUMERABLE){for(var i=0,len=obj.length;i<len;++i){results.push(String(i))}}return results});!Object.getOwnPropertyNames&&(function(){var __notEnumerableProperties=(function(){var props=[{object:Object,keys:['getOwnPropertyNames','seal','create','isFrozen','keys','isExtensible','getOwnPropertyDescriptor','preventExtensions','getPrototypeOf','defineProperty','isSealed','defineProperties','freeze']},{object:Object.prototype,keys:['toString','__lookupGetter__','__defineGetter__','toLocaleString','hasOwnProperty','valueOf','__defineSetter__','propertyIsEnumerable','isPrototypeOf','__lookupSetter__']},{object:Function.prototype,keys:['bind','arguments','toString','length','call','name','apply','caller']},{object:Number,keys:['NaN','NEGATIVE_INFINITY','POSITIVE_INFINITY','MAX_VALUE','MIN_VALUE']},{object:Number.prototype,keys:['toExponential','toString','toLocaleString','toPrecision','valueOf','toFixed']},{object:String,keys:['fromCharCode']},{object:String.prototype,keys:['length','concat','localeCompare','substring','italics','charCodeAt','strike','indexOf','toLowerCase','trimRight','toString','toLocaleLowerCase','replace','toUpperCase','fontsize','trim','split','substr','sub','charAt','blink','lastIndexOf','sup','fontcolor','valueOf','link','bold','anchor','trimLeft','small','search','fixed','big','match','toLocaleUpperCase','slice']},{object:Boolean.prototype,keys:['toString','valueOf']},{object:Date,keys:['now','UTC','parse']},{object:Date.prototype,keys:['toUTCString','setMinutes','setUTCMonth','getMilliseconds','getTime','getMinutes','getUTCHours','toString','setUTCFullYear','setMonth','getUTCMinutes','getUTCDate','setSeconds','toLocaleDateString','getMonth','toTimeString','toLocaleTimeString','setUTCMilliseconds','setYear','getUTCFullYear','getFullYear','getTimezoneOffset','setDate','getUTCMonth','getHours','toLocaleString','toISOString','toDateString','getUTCSeconds','valueOf','setUTCMinutes','getUTCDay','toJSON','setUTCDate','setUTCSeconds','getYear','getUTCMilliseconds','getDay','setFullYear','setMilliseconds','setTime','setHours','getSeconds','toGMTString','getDate','setUTCHours']},{object:RegExp,keys:['$*','$`','$input','$+','$&',"$'",'$_']},{object:RegExp.prototype,keys:['toString','exec','compile','test']},{object:Error.prototype,keys:['toString']},{object:Math,keys:['LN10','PI','E','LOG10E','SQRT2','LOG2E','SQRT1_2','LN2','cos','pow','log','tan','sqrt','ceil','asin','abs','max','exp','atan2','random','round','floor','acos','atan','min','sin']},{object:global,keys:['TypeError','decodeURI','parseFloat','Number','URIError','encodeURIComponent','RangeError','ReferenceError','RegExp','Array','isNaN','Date','Infinity','Boolean','Error','NaN','String','Function','Math','undefined','encodeURI','escape','unescape','decodeURIComponent','EvalError','SyntaxError','Object','eval','parseInt','JSON','isFinite']},{test:function(obj){return typeof JSON!=='undefined'&&obj===JSON},keys:['stringify','parse']},{test:function(obj){return Array.isArray(obj)||__isString(obj)},keys:['length']},{test:function(obj){return obj instanceof RegExp},testValue:new RegExp('.+'),keys:['lastIndex','multiline','global','source','ignoreCase']},{test:function(obj){return typeof obj==='function'&&obj.apply&&obj.call},testValue:function(a,b,c){},keys:['arguments','length','name','prototype','caller']}];for(var i=0,ilen=props.length;i<ilen;++i){if(props[i].object){if(typeof props[i].object==='function'){props[i].keys.push('arguments','length','name','prototype','caller')}else if(typeof props[i].object==='object'&&props[i].object!==Math&&props[i].object!==global){props[i].keys.push('constructor')}for(var j=props[i].keys.length-1;j>=0;--j){if(!(props[i].keys[j]in props[i].object)||__propertyIsEnumerable(props[i].object,props[i].keys[j])){props[i].keys.splice(j,1)}}}else if(props[i].test&&props[i].testValue&&props[i].test(props[i].testValue)){for(var j=props[i].keys.length-1;j>=0;--j){if(!(props[i].keys[j]in props[i].testValue)||__propertyIsEnumerable(props[i].testValue,props[i].keys[j])){props[i].keys.splice(j,1)}}delete props[i].testValue}}return props})();var __len=__notEnumerableProperties.length;Object.getOwnPropertyNames=function(obj){var keys=Object.keys(obj);for(var i=0;i<__len;++i){if((__notEnumerableProperties[i].object&&__notEnumerableProperties[i].object===obj)||(__notEnumerableProperties[i].test&&__notEnumerableProperties[i].test(obj))){keys=keys.concat(__notEnumerableProperties[i].keys);break}}return keys}})();var __isObject=function(obj){return obj&&(typeof obj==='object'||typeof obj==='function')};var __isString=function(obj){return typeof obj==='string'||Object.prototype.toString.call(obj)==='[object String]'};var __firstIndex=function(arr){for(var k=0,len=arr.length;k<len;++k){if(arr.hasOwnProperty(String(k))){return k}}return-1};var __toPropertyDescriptor=function(obj){if(!obj||typeof obj!=='object')throw new TypeError(obj+" is not an object");var desc={};obj.hasOwnProperty("enumerable")&&(desc.enumerable=!!obj.enumerable);obj.hasOwnProperty("configurable")&&(desc.configurable=!!obj.configurable);obj.hasOwnProperty("writable")&&(desc.writable=!!obj.writable);obj.hasOwnProperty("value")&&(desc.value=obj.value);if(obj.hasOwnProperty("get")){if(!__isCallable(obj.get)&&typeof obj.get!=='undefined')throw new TypeError("Getter must be a callable object");desc.get=obj.get}if(obj.hasOwnProperty("set")){if(!__isCallable(obj.set)&&typeof obj.set!=='undefined')throw new TypeError("Setter must be a callable object");desc.set=obj.set}if((desc.hasOwnProperty("get")||desc.hasOwnProperty("set"))&&(desc.hasOwnProperty("writable")||desc.hasOwnProperty("value"))){throw new TypeError("Invalid property. A property cannot both have accessors and be writable or have a value");}return desc};var __isCallable=(function(){var __sortCase=(function(){try{[].sort('abc');return false}catch(ex){return true}})();return function(obj){if(typeof obj==='function')return true;if(typeof obj!=='object')return false;if(obj instanceof Function||obj instanceof RegExp)return true;if(__sortCase){try{[].sort(obj);return true}catch(ex){}}return false}})()})(this);/**
 * Creates an array containing a list of numbers in the range
 */
Object.defineProperties(Array, {
  
  intersect: { value: function intersect(arrays) {
    /**
     * Finds the intersection between one or more different arrays. This can be useful so to use the array as a set. Equivalent to the ampersand (&) operator. Equality checks are strict - again use the indexOf method.
     *
     * @since 1.4.0
     * @param arrays An array of arrays to find the intersection
     * @alias intersection
     * @example
     *  Array.intersect([[2,3,4], [3,4,5]]);
     *    // returns [3]
     *
     * @returns array
     */
    return arrays.first().filter(function(val) {
      return arrays.every(function(arg) {
        return arg.contains(val);
      });
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  diff: { value: function diff(arrays) {
    /**
     * Finds values which are unique to only one array from all that are given as parameters (including the current instance). Regarded as the opposite as intersect. Again equality tests are strict.
     *
     * @since 1.4.0
     * @param arrays The arrays to differentiate with
     * @alias difference
     * @example
     *  Array.diff([[1,2,3],[2,3,4],[3,4,5]]);
     *    // returns [1,5]
     *
     * @returns array
     */
    var vals = arrays.flatten(1);

    return vals.filter(function(a) {
      return vals.indexOf(a) == vals.lastIndexOf(a);
    });

  }, writable: true, enumerable: false, configurable: true },
  
  union: { value: function union(arrays) {
    /**
     * Creates an array with distinct values from each of the arrays given as parameters.
     *
     * @since 1.4.0
     * @param arrays The arrays to union
     * @example
     *  Array.union([[1,2,3],[3,4,5],[5,6,7]]);
     *    // returns [1,2,3,4,5,6,7]
     *
     * @returns array
     */
    return Array.prototype.concat.apply([], arrays).unique();

  }, writable: true, enumerable: false, configurable: true },
  
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
     * @alias switch
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
    args = Array.prototype.slice.call(arguments);
    
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
     * @alias delete
     * @example
     *  var arr = [5, 2, 5, 7];
     *  arr.remove(5, 2); // [7]
     * 
     * @returns self
     */
    args = Array.prototype.slice.call(arguments);
      
    args.forEach(function(arg) {
      if (this.contains(arg))
        this.splice(this.indexOf(arg), 1);
    }.bind(this));
    
    return this;
    
  }, writable: true, enumerable: false, configurable: true },
  
  shuffle: { value: function shuffle() {
    /**
     * Re-orders all values within the array into a random order. The method is simple and relies on Number.random() to generate random numbers which is automatically seeded.
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
      arr.swap(index, Number.random(index, arr.length - 1).round());
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
      this.swap(index, Number.random(index, this.length - 1).round());
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
    return Array.intersect(Array.prototype.slice.call(arguments).concat([this]));
    
  }, writable: true, enumerable: false, configurable: true },

  diff: { value: function diff() {
    /**
     * Finds values which are unique to only one array from all that are given as parameters (including the current instance). Regarded as the opposite as intersect. Again equality tests are strict.
     *
     * @since 1.0.0
     * @alias difference
     * @param *arrays The arrays to differentiate with
     * @example
     *  [1,2,3].diff([2,3,4], [3,4,5]);
     *    // returns [1,5]
     *
     * @returns array
     */
    return Array.diff(Array.prototype.slice.call(arguments).concat([this]));

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
    return Array.union(Array.prototype.slice.call(arguments).concat([this]));

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
     * @param property|array The name of the property or array of keys to pluck.
     * @example
     *  ['hello','world','this','is','nice'].pluck('length');
     *    // returns [5, 5, 4, 2, 4]
     *
     *  // Since 1.4.0:
     *  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
     *      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
     *      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' }
     *  
     *  [a,b,c].pluck(['name', 'age']);
     *    // returns [{ name: 'Ann', age: 36 }, { name: 'Bob', age: 21 }, { name: 'Charlie', age: 31 }]
     *
     * @returns array
     */
    return this.map(function(val) {
      if (Array.isArray(prop))
        return Object.filter(val, prop);
      
      return val[prop];
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  pluck$: { value: function pluck$(prop) {
    /**
     * The self-modification version of Array#pluck
     *
     * @since 1.3.0
     * @param property|array The name of the property or array of keys to pluck.
     * @example
     *  var a = ['hello','world','this','is','nice'];
     *  a.pluck('length');
     *    // a = [5, 5, 4, 2, 4]
     *
     *  // Since 1.4.0:
     *  var a = { name: 'Ann', age: 36, pass: 's8J2ld0a' },
     *      b = { name: 'Bob', age: 21, pass: '0aJdlfsa' },
     *      c = { name: 'Charlie', age: 31, pass: 'f8fadasa' }
     *  
     *  var arr = [a,b,c];
     *
     *  arr.pluck$(['name', 'age']);
     *    // arr = [{ name: 'Ann', age: 36 }, { name: 'Bob', age: 21 }, { name: 'Charlie', age: 31 }]
     *    // Note that the original objects are left intact!
     *
     * @returns self
     */
    return this.map$(function(val) {
      if (Array.isArray(prop))
        return Object.filter(val, prop);
        
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
     * @param [callback] The comparison function
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
     * @param [comparison] The comparison callback used in the sort afterwords.
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
      sort = function(a,b) { return String(a) - String(b) };

    // Get the values we intend to sort
    var arr = this[typeof cmp === 'function' ? 'map' : 'pluck'](cmp).map(function(val, i) {
      return { key: i, val: val };
    });

    return arr.sort(function(a,b) {
      return sort(a.val, b.val);
    }).map(function(val) {
      return this[val.key];
    }, this);
    
  }, writable: true, enumerable: false, configurable: true },
  
  sortBy$: { value: function sortBy$(cmp, sort) {
    /**
     * The self-modifying version of sortBy
     *
     * @since 1.3.0
     * @param mapping The mapping callback to apply to each value.
     * @param [comparison] The comparison callback used in the sort afterwords.
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
      order = Array.prototype.slice.call(arguments);
      
    var arr = [];
    
    order.forEach(function(o, i) {
      arr[o] = this[i];
    }, this);
    
    return arr;
    
  }, writable: true, enumerable: false, configurable: true }
  
});Object.defineProperties(Function, {
  
  compose: { value: function compose(funcs) {
    /**
     * Creates a new function based on the composite of all the functions given. The list of functions can either be given as an array as the first parameter or a continuous set of functions.
     *
     * @since 1.2.0
     * @param funcs* The functions to create the composite
     * @example
     *  function A(a) { return a ^ 2 }
     *  function B(a) { return a / 2 }
     *  var C = Function.compose(A, B);
     *  C(5) // Same as A(B(5))
     *
     * @returns function
     */
    if ( ! Array.isArray(funcs)) {
      funcs = Array.prototype.slice.call(arguments);
    }
    
    funcs = funcs.reverse();
    
    return function(arg) {
      return funcs.reduce(function(a,b) {
        return b(a);
      }, arg);
    }
    
  }, writable: true, enumerable: false, configurable: true }
  
});

Object.defineProperties(Function.prototype, {

  cache: { value: function cache(time, ident) {
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
     *  // fibonacci(50) will take a several minutes to complete
     *
     *  var fibonacci = fibonacci.cache();
     *  // fibonacci(1000) will now take roughly 13ms to complete!
     * 
     * @returns function
     */
    time = isNaN(time) ? -1 : time;
    ident = ident || function(id) {
      return (typeof id == 'object') ? Object.id(id) : id.toString();
    }
    
    var cache = {}, callback = this, timeouts = {};
    
    return function() {
      
      var args = Array.prototype.slice.call(arguments), id = '(' + args.map(ident).join(',') + ')';
      
      if ( ! (id in cache)) cache[id] = callback.apply(callback, args);
      else if (id in timeouts) {
        clearTimeout(timeouts[id]);
        delete timeouts[id];
      }

      if (time > 0) {
        timeouts[id] = setTimeout(function() {
          delete cache[id];
        }, time);
      }
            
      return cache[id];
    }
     
  }, writable: true, enumerable: false, configurable: true },
  
  delay: { value: function delay(callback, time, scope) {
    /**
     * Delays a function by a certain amount of time then calls the callback with the result of the function
     *
     * @since 1.2.0
     * @param time The number of milliseconds before calling the function.
     * @param scope The value of this within the callback.
     * @example
     *  Date.now.delay(function(now, then) {
     *    log(now - then); // > 50 (Or very near it!)
     *  }, 50, Date.now());
     * 
     * @returns function
     */
    return setTimeout(function(args) {
      callback.apply(scope, [this()].concat(Array.prototype.slice.call(args, 2)));
    }.bind(this, arguments), time);
    
  }, writable: true, enumerable: false, configurable: true },
  
  once: { value: function once(scope) {
    /**
     * Caches a function indefinately. Once the callback is called for the first time it will continue to return that same value. Make sure if the function resides within an instantiated object that you have set the scope parameter.
     *
     * @since 1.4.0
     * @param scope Unfortunately the original function will loose it's scope. Re-add it here.
     * @example
     *  function A() { this.foo = 'bar'; }
     *  A.prototype.getFoo = function() { return this.foo; }
     *
     *  var obj = new A();
     *  obj.getFoo = obj.getFoo.once(); // INCORRECT! don't forget scope!
     *  obj.getFoo = obj.getFoo.once(obj); // Correct :)
     *
     *  obj.getFoo();
     *    // returns 'bar'
     *
     *  obj.foo = 'bat';
     *
     *  obj.getFoo();
     *    // returns 'bar' again!
     * 
     * @returns function
     */
    var called = false, val = null;
    
    return function(args) {
      
      if ( ! called) {
        called = true;
        val = this.apply(scope, args);
      }
      
      return val;
      
    }.bind(this, Array.prototype.slice.call(arguments));
    
  }, writable: true, enumerable: false, configurable: true }
  
});Object.defineProperties(Number, {
  
  random: { value: function random(start, end) {
    /**
     * Random number between two values.
     *
     * @since 1.0.0
     * @param [start=0] A number to start from
     * @param [end=1] A number to go to
     * @example
     *  Math.random(100, 1000)
     *    // returns something like 521.61242932 (between 100 and 1000)
     *
     *  Math.random()
     *    // returns something like 0.61242932 (between 0 and 1)
     * 
     * @returns int
     */  
    return (start = start || 0) + (((end || start + 1) - start) * Math.random());
    
  }, writable: true, enumerable: false, configurable: true }

});


Object.defineProperties(Number.prototype, {
  
  chr: { get: function() {
    /**
     * Gets the current integer's representing string character.
     *
     * @since 1.1.0
     * @example
     *  (72).chr
     *    // returns 'H'
     * 
     * @returns string
     */
    return String.fromCharCode(this);
    
  }, enumerable: false, configurable: true },
  
  odd: { get: function() {
    /**
     * Determine's whether this integer is an odd number.
     *
     * @since 1.1.0
     * @example
     *  (12).odd // false
     *  (13).odd // true
     * 
     * @returns boolean
     */
    return ! this.even;
    
  }, enumerable: false, configurable: true },
  
  even: { get: function() {
    /**
     * Determine's whether this integer is an even number.
     *
     * @since 1.1.0
     * @example
     *  (12).odd // true
     *  (13).odd // false
     * 
     * @returns boolean
     */
    return (this % 2) == 0;
    
  }, enumerable: false, configurable: true },
  
  gcd: { value: function gcd() {
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
    return Array.prototype.slice.call(arguments).reduce(function(a, b) {
      
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  lcm: { value: function lcm() {
    /**
     * Calculates the lowest common multiple between a set of numbers. Uses GCD within the caluclation.
     *
     * @since 1.1.0
     * @param *int The numbers to calculate
     * @example
     *  (21).gcd(6)
     *    // returns 42
     * 
     * @returns integer
     */
    var nums = Array.prototype.slice.call(arguments), gcd = this.gcd.apply(this, nums);

    return Math.abs(nums.product() * this) / gcd;
    
  }, writable: true, enumerable: false, configurable: true },
  
  ceil: { value: function ceil() {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  floor: { value: function floor() {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  abs: { value: function abs() {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  round: { value: function round(digits) {
    /**
     * Rounds the number to a given number of digits. Negative numbers are possible. This is similar to Ruby's round().
     *
     * @since 1.1.0
     * @param [digits=0] The number of digits
     * @example
     *  1.5.round()
     *    // returns 2
     *
     *  (1).round(1)
     *    // returns '1.0'
     *
     *  (15).round(-1)
     *    // returns 20
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  radix: { value: function radix(base, size, character) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  bin: { value: function bin(size, character) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  oct: { value: function oct(size, character) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  dec: { value: function dec(size, character) {
    /**
     * Decimal representation of a number.
     *
     * @since 1.3.0
     * @param [width] The minimum number of characters.
     * @param [pad='0'] The character to pad.
     * @example
     *  (80).dec(4);
     *    returns '0080'
     * 
     * @returns string
     */
    return this.radix(0x0A, size, character);
    
  }, writable: true, enumerable: false, configurable: true },
  
  hexl: { value: function hexl(size, character) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  hex: { value: function hex(size, character) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  abbr: { value: function abbr(digits, binary) {
    /**
     * The shorthand abbreviation for a number. You're a programmer! Normal people aren't. Binary defaults to false. BOOO!
     *
     * @since 1.3.0
     * @param [precision=0] The number of digits to include after the decimal point.
     * @param [binary=false] Whether the devisor should be a power of 2.
     * @example
     *  (1024).abbr();
     *    returns '1K'
     *
     *  (1024).abbr(3);
     *    returns '1.024K'
     *
     *  (1024).abbr(3, true);
     *    returns '1.000K'
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
    
  }, writable: true, enumerable: false, configurable: true }

});Object.defineProperties(Object, {
  
  id: { value: function id(obj) {
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
     *  Object.id(a) == Object.id(b)
     *    // true
     * 
     * @returns string
     */
    id.store = id.store || [];
    
    if ( ! id.store.contains(obj))
      id.store.push(obj);

    return id.store.indexOf(obj);
    
  }, writable: true, enumerable: false, configurable: true },
  
  alias: { value: function alias(object, property, alias, complete) {
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
     *  log(obj[3] == obj[6]) // > true
     *  
     *  obj[3] = 5;
     *
     *  log(obj[3] == obj[6]) // > true
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
        desc.get = function() {
          return object[property];
        }
      }

      desc.set = function(val) {
        return object[property] = val;
      }

      Object.defineProperty(object, alias, desc);
    }
    
    return object;

  }, writable: true, enumerable: false, configurable: true },

  values: { value: function values(obj) {
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
    for (key in obj) {
      arr.push(obj[key]);
    }
    
    return arr;
    
  }, writable: true, enumerable: false, configurable: true },
  
  forEach: { value: function forEach(obj, callback, scope) {
    /**
     * A fast looping mechanism for objects. Like Array.forEach.
     *
     * @since 1.0.0
     * @param object
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  Object.forEach({1:2,3:4}, function(key, val, obj) {
     *    log(key + ':' + val)
     *  });
     *  // > 1:2
     *  // > 3:4
     * 
     * @returns void
     */
    return Object.keys(obj).forEach(function(key) {
      return callback.call(scope, key, obj[key], obj);
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  isObject: { value: function isObject() {
    /**
     * Returns whether all the given parameters are objects
     *
     * @since 1.0.0
     * @param *objects
     * @example
     *  Object.isObject({1:2,3:4});
     *    // returns true
     *  
     *  Object.isObject(function() { });
     *    // returns false
     *
     *  Object.isObject({1:2,3:4}, function() { });
     *    // returns false
     * 
     * @returns bool
     */
    return Object.values(arguments).every(function(value) {
      return typeof value === 'object' && Object(value) === value;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  each: { value: function each(obj, callback, scope) {
    /**
     * Provides a utility to quickly iterate through enumerable properties of an object.
     *
     * @since 1.0.0
     * @param object The object you want to iterate through
     * @param function The callback that takes parameters (key, value, object)
     * @param scope The value of this in the callback function.
     * @example
     *  var ret = Object.each({1:2,3:4}, function(key, val, obj) {
     *    return (key + ':' + val);
     *  });
     *  // ret = 1:2
     * 
     * @returns mixed
     */
    var key, result;
    for (key in obj)
      if ((result = callback.call(scope, key, obj[key], this)) !== undefined)
        return result;
    
  }, writable: true, enumerable: false, configurable: true },
  
  map: { value : function map(object, callback, scope) {
    /**
     * Similar to Array.map except for enumerable object properties.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  Object.map({1:2,3:4}, function(key, val) {
     *    return key * val;
     *  });
     *  // returns {1:2,3:12}
     * 
     * @returns object
     */
    var obj = Object.clone(object);

    Object.map$(obj, callback, scope);

    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  map$: { value : function map$(obj, callback, scope) {
    /**
     * A self-modification version of Object.map.
     *
     * @since 1.3.0
     * @param object The object you want to map
     * @param function The callback that takes parameters (value, key) and should return a new value
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4};
     *  Object.map(obj, function(key, val) {
     *    return key * val;
     *  });
     *  // obj = {1:2,3:12}
     * 
     * @returns self
     */
     Object.forEach(obj, function(key, val) {
       obj[key] = callback.call(scope, key, val);
     });
     
     return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  getOwnPropertyDescriptors: { value : function getOwnPropertyDescriptors(object) {
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

    Object.getOwnPropertyNames(object).forEach(function(key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(object, key);
    });

    return descriptors;
    
  }, writable: true, enumerable: false, configurable: true },
  
  reduce: { value : function reduce(obj, callback, start, scope) {
    /**
     * Like Array.reduce except for objects. Reduces the object down into a single value.
     *
     * @since 1.0.0
     * @param object The object you want to map
     * @param callback The function to call on each iteration
     * @param [start=undefined] The initial value
     * @example
     *  Object.reduce({1:2,3:4}, function(group, key, val) {
     *    return group + key + val;
     *  }, 0);
     *  // returns 10 (0+1+2+3+4)
     * 
     * @returns mixed
     */
    Object.forEach(obj, function(key, val) {
      start = callback.call(scope, start, key, obj[key]);
    });
    
    return start;
    
  }, writable: true, enumerable: false, configurable: true },
  
  merge: { value : function merge(objects, level) {
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
      objects = Object.values(arguments), level = 0;
    }
    
    level = (level === undefined) ? 0 : level;
    
    return objects.reduce(function(group, obj) {
      Object.forEach(obj, function(key, val) {
        if ( ! val in group || level == 0 || ! Object.isObject(group[key]) || ! Object.isObject(val)) {
          group[key] = val;
        }
        else {
          group[key] = Object.merge([group[key], val], level - 1);
        }
      });
      
      return group;
      
    }, {});
    
  }, writable: true, enumerable: false, configurable: true },
  
  merge$: { value : function merge$(object, objects, level) {
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

    Object.filter$(object, function(key, val) { return (key in obj); });
    Object.map$(object, function(key, val) { return obj[key]; });

    Object.keys(obj).diff(Object.keys(object)).forEach(function(key) {
      object[key] = obj[key];
    });

    return object;
    
  }, writable: true, enumerable: false, configurable: true },
  
  clone: { value: function clone(obj, inherit) {
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
    
    return Object.create(Object.getPrototypeOf(obj), inherit ? Object.getOwnPropertyDescriptors(obj) : undefined);
    
  }, writable: true, enumerable: false, configurable: true },

  filter: { value : function filter(object, callback, scope) {
    /**
     * Like Array.filter except for objects. Only enumerable values are filtered.
     *
     * @since 1.0.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  Object.filter({1:2,3:4,5:6}, function(key, val, object) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  filter$: { value : function filter$(obj, callback, scope) {
    /**
     * Self-modification version of Object.filter.
     *
     * @since 1.3.0
     * @param object The object you want to filter
     * @param callback|array The callback to call on each property or an array of keys.
     * @param scope The value of this in the callback function.
     * @example
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, function(key, val, object) {
     *    return key == 3;
     *  });
     *  // obj = {3:4} 
     *
     *  // Since 1.4.0:
     *  var obj = {1:2,3:4,5:6};
     *  Object.filter$(obj, [1,3]);
     *  // obj = {1:2,3:4}
     * 
     * @returns self
     */
    if (Array.isArray(callback)) var keys = callback.invoke('toString');
    Object.forEach(obj, function(key, val) {
      if (Array.isArray(callback)) {
        if ( ! keys.contains(key))
          delete obj[key];
      }
      else if (callback.call(scope, key, val, obj) === false)
        delete obj[key];
    });
    
    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  clean: { value : function clean(obj) {
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
    return Object.filter(obj, function(key, val) {
      return !! val;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  clean$: { value : function clean$(obj) {
    /**
     * A self-modification version of Object.clean.
     *
     * @since 1.3.0
     * @param object The object you want to clean
     * @example
     *  var obj = {1:false,2:0,3:NaN,4:null,5:6};
     *  Object.clean(obj);
     *    // obj = {5:6} 
     * 
     * @returns object
     */
    return Object.filter$(obj, function(key, val) {
      return !! val;
    });
    
  }, writable: true, enumerable: false, configurable: true },
  
  size: { value : function size(obj) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  combine: { value : function combine(keys, values) {
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
    
    keys.forEach(function(key, i) {
      obj[key] = values[i];
    });
    
    return obj;
    
  }, writable: true, enumerable: false, configurable: true },
  
  hash: { value : function hash(object) {
    /**
     * Creates an enumerable wrapper around the given objcet. Useful for simple hashes and not complex classes. Added functions: length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = Object.hash({a:1,b:2,c:3,d:4});
     *  obj.length // returns 4
     *  // length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.hash$(Object.clone(object));
    
  }, writable: true, enumerable: false, configurable: true },
  
  
  hash$: { value : function hash$(object) {
    /**
     * The self modification version of Object.hash. New methods are defined to the current object rather than a clone.
     *
     * @since 1.4.0
     * @param object The object we're going to wrap
     * @example
     *  var obj = {a:1,b:2,c:3,d:4};
     *  Object.hash$(obj);
     *  obj.length // returns 4
     *  // length, keys(), each(), forEach(), map(), map$(), filter(), filter$(), reduce(), clean(), clean$(), clone(), merge(), merge$()
     * 
     * @returns object
     */
    return Object.defineProperties(object, {
      
      length: { get: function() {
        return Object.size(this);
      }, enumerable: false, configurable: true },
      
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
    
  }, writable: true, enumerable: false, configurable: true }
  
});Object.defineProperties(String, {
  
  UUID: { value: function UUID() {
    /**
     * Creates a RFC 4122 compliant UUID. This implementation relies on Number.random(). Even so you can be assured that each generation is pretty much always going to be different.
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
        case 19: i = (Number.random(0, 16).floor() & 0x3) | 0x8; break;
        default: i = Number.random(0, 16).floor(); break;
      }
      return '0123456789ABCDEF'[i];
    }).join('');
    
  }, writable: true, enumerable: false, configurable: true }
  
});


Object.defineProperties(String.prototype, {

  chars: { value: function chars(obj) {
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
  
  count: { value: function count(substr, mod) {
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
  
  insert: { value: function insert(substr, pos) {
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
  
  remove: { value: function remove(substr) {
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
  
  reverse: { value: function reverse() {
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
  
  ucfirst: { value: function ucfirst() {
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
  
  swapcase: { value: function swapcase() {
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
  
  rpad: { value: function rpad(len, chars) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  lpad: { value: function lpad(len, chars) {
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
    
  }, writable: true, enumerable: false, configurable: true },
  
  pad: { value: function pad(len, chars) {
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
    
  }, writable: true, enumerable: false, configurable: true },

  soundex: { value: function soundex() {
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

  }, writable: true, enumerable: false, configurable: true },
  
  distance: { value: function distance(c) {
    /**
     * Calculates the distance between 2 strings using Levenshtein's algorithm.
     *
     * @since 1.2.0
     * @param string The string to find the distance from
     * @see http://en.wikipedia.org/wiki/Levenshtein_distance
     * @example
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
        
  }, writable: true, enumerable: false, configurable: true },
  
  
  soundex: { value: function soundex() {
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

  }, writable: true, enumerable: false, configurable: true },
  
  sprintf: { value: function sprintf(c) {
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
     * @returns string
     */
    var vals = arguments, regex = /%%|%(?:(\d+)[\$#])?([+-])?('.|0| )?(\d*)(?:\.(\d+))?([bcdfosuxX])/g;
    var index = 0;
    
    return this.replace(regex, function(substr, flags, align, padding, width, precision, type) {
      
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
        
  }, writable: true, enumerable: false, configurable: true }
  
});