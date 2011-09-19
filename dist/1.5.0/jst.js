// vim:set ts=4 sts=4 sw=4 st:
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright(C) 2010 XXX No License Specified
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(function () {
            definition();
        });
    // CommonJS and <script>
    } else {
        definition();
    }

})(function (undefined) {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 *
 * @module
 */

/*whatsupdoc*/

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        // XXX this gets pretty close, for all intents and purposes, letting
        // some duck-types slide
        if (typeof target.apply != "function" || typeof target.call != "function")
            return new TypeError();
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (result !== null && Object(result) === result)
                    return result;
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };

        // XXX bound.length is never writable, so don't even try
        //
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var toString = prototypeOfObject.toString;
var owns = call.bind(prototypeOfObject.hasOwnProperty);

var defineGetter, defineSetter, lookupGetter, lookupSetter, supportsAccessors;
// If JS engine supports accessors creating shortcuts.
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return toString.call(obj) == "[object Array]";
    };
}

// ES5 15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!prototypeOfArray.forEach) {
    prototypeOfArray.forEach = function forEach(fun /*, thisp*/) {
        var self = Object(this),
            thisp = arguments[1],
            i = 0,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!fun || !fun.call) {
            throw new TypeError();
        }

        while (i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
            i++;
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!prototypeOfArray.map) {
    prototypeOfArray.map = function map(fun /*, thisp*/) {
        var self = Object(this);
        var length = self.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();
        var result = new Array(length);
        var thisp = arguments[1];
        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
if (!prototypeOfArray.filter) {
    prototypeOfArray.filter = function filter(fun /*, thisp */) {
        var self = Object(this);
        var length = self.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();
        var result = [];
        var thisp = arguments[1];
        for (var i = 0; i < length; i++)
            if (i in self && fun.call(thisp, self[i], i, self))
                result.push(self[i]);
        return result;
    };
}

// ES5 15.4.4.16
if (!prototypeOfArray.every) {
    prototypeOfArray.every = function every(fun /*, thisp */) {
        if (this === void 0 || this === null)
            throw new TypeError();
        if (typeof fun !== "function")
            throw new TypeError();
        var self = Object(this);
        var length = self.length >>> 0;
        var thisp = arguments[1];
        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self))
                return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!prototypeOfArray.some) {
    prototypeOfArray.some = function some(fun /*, thisp */) {
        if (this === void 0 || this === null)
            throw new TypeError();
        if (typeof fun !== "function")
            throw new TypeError();
        var self = Object(this);
        var length = self.length >>> 0;
        var thisp = arguments[1];
        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!prototypeOfArray.reduce) {
    prototypeOfArray.reduce = function reduce(fun /*, initial*/) {
        var self = Object(this);
        var length = self.length >>> 0;
        // Whether to include (... || fun instanceof RegExp)
        // in the following expression to trap cases where
        // the provided function was actually a regular
        // expression literal, which in V8 and
        // JavaScriptCore is a typeof "function".  Only in
        // V8 are regular expression literals permitted as
        // reduce parameters, so it is desirable in the
        // general case for the shim to match the more
        // strict and common behavior of rejecting regular
        // expressions.  However, the only case where the
        // shim is applied is IE's Trident (and perhaps very
        // old revisions of other engines).  In Trident,
        // regular expressions are a typeof "object", so the
        // following guard alone is sufficient.
        if (toString.call(fun) != "[object Function]")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length)
                    throw new TypeError();
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self)
                result = fun.call(null, result, self[i], i, self);
        }

        return result;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!prototypeOfArray.reduceRight) {
    prototypeOfArray.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = Object(this);
        var length = self.length >>> 0;
        if (toString.call(fun) != "[object Function]")
            throw new TypeError();
        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1)
            throw new TypeError();

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError();
            } while (true);
        }

        do {
            if (i in this)
                result = fun.call(null, result, self[i], i, self);
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!prototypeOfArray.indexOf) {
    prototypeOfArray.indexOf = function indexOf(sought /*, fromIndex */ ) {
        if (this === void 0 || this === null)
            throw new TypeError();
        var self = Object(this);
        var length = self.length >>> 0;
        if (!length)
            return -1;
        var i = 0;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!prototypeOfArray.lastIndexOf) {
    prototypeOfArray.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        if (this === void 0 || this === null)
            throw new TypeError();
        var self = Object(this);
        var length = self.length >>> 0;
        if (!length)
            return -1;
        var i = length - 1;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || object.constructor.prototype;
        // or undefined if not available in this engine
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return undefined;

        var descriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (typeof properties != "undefined")
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
var oldDefineProperty = Object.defineProperty;
var defineProperty = !!oldDefineProperty;
if (defineProperty) {
    // detect IE 8's DOM-only implementation of defineProperty;
    var subject = {};
    Object.defineProperty(subject, "", {});
    defineProperty = "" in subject;
}
if (!defineProperty) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if (typeof object != "object" && typeof object != "function")
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if (typeof descriptor != "object" || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (oldDefineProperty && object.nodeType)
            return oldDefineProperty(object, property, descriptor);

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        return true;
    };
}

// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if (
            typeof object != "object" && typeof object != "function"
            || object === null
        )
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a simplified subset of the ISO 8601
// standard as defined in 15.9.1.15.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value;
        if (!isFinite(this))
            throw new RangeError;

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10)
                result[length] = "0" + value;
        }
        // pad milliseconds to have three digits.
        return result.slice(0, 3).join("-") + "T" + result.slice(3).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        // XXX this gets pretty close, for all intents and purposes, letting
        // some duck-types slide
        if (typeof this.toISOString.call != "function")
            throw new TypeError();
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString.call(this);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("2011-06-15T21:40:05+06:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function(Y, M, D, h, m, s, ms) {
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
}

//
// String
// ======
//

// ES5 15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) // isNaN
        n = -1;
    else if (n !== 0 && n !== (1/0) && n !== -(1/0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    return n;
};

});/**
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
     *  a.filter(function(n) { return n.even() });
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
    var sorted = (typeof sort === 'function') ? this.sort(sort) : this.sort();
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
      return (typeof sort === 'function') ? this.sort(sort) : this.sort();

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
  
  chr: { value: function() {
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
    
  }, enumerable: false, configurable: true },
  
  odd: { value: function() {
    /**
     * Determine's whether this integer is an odd number.
     *
     * @since 1.1.0
     * @example
     *  (12).odd() // false
     *  (13).odd() // true
     * 
     * @returns boolean
     */
    return ! this.even();
    
  }, enumerable: false, configurable: true },
  
  even: { value: function() {
    /**
     * Determine's whether this integer is an even number.
     *
     * @since 1.1.0
     * @example
     *  (12).even() // true
     *  (13).even() // false
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
    return Array.prototype.slice.call(arguments).every(function(value) {
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
      objects = Array.prototype.slice.call(arguments), level = 0;
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
    return this.charAt(0).toUpperCase() + this.substr(1);
    
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