# ECMA5 Multi-Purpose Javascript Toolkit

## As of 1.5.0 and to the future!
Many people requested JSToolkit to be available to the browser. I had until now been very specific that I wanted to focus on development for ECMA5 platforms and not be restricted by browser limitations, especially with Object notations and descriptors. However I had a look through some es5-shim libraries and decided to take the plunge and write a fully compatible toolkit library that works on the browser and brings ECMA5 goodness to it. Of course there are some things which you simply can't patch up. But as long as you follow these rules, you should never go wrong:

Every time you use a JSToolkit Object.* method on an object, you must assume it has been tampered with. The reality is that JSToolkit creates a property called `__ownPropertyDescriptors__` and `__proto__` which holds descriptor information for that object's own properties. This is used internally by JSToolkit in all it's processing methods. However in legacy browsers these methods will be made enumerable which is disastrous for many applications, for this reason if you follow these rules you should remain file:

1. delete object['prop'] => Object.remove(object, 'prop'); // Use this if you want to respect the descriptor configurable
2. object['foo'] = 'bar' => Object.value(object, 'foo', 'bar'); // Use this if you want to respect the descriptor writable
3. for (key in object)   => Object.forEach(object, function(key, value) { });

And keep clear of:

    Object.prototype.__ownPropertyDescriptors__
    Object.prototype.__proto__

They're mine!

Once you're finished with JSToolkit processing, a simple call to Object.purify() will clean the object up to get rid of all our rubbish inside it.

## Goals & Features
The JS Toolkit has very specific goals - as to not re-invent the wheel. They go as follows:

* Complete Unit-Test coverage.
* Designed entirely for ECMA5 applications - Node.JS/V8 specifically.
* Performance is key and is achieved through elegance and simplicity.
* ECMA5 introduced a number of new Object definition descriptors which must be respected.
* Eases development by extending type prototypes safely. Object.prototype is left untouched.
* Use accelerated native functions and fully embrace the new ECMA5 specification.

## Installation
It is recommended that you install toolkit globally. It's designed to be a totally generic turbo-charger for javascript's native objects and will hopefully continue to expand and flourish.

> Note if you plan to use it *ensure you include it as an npm dependency* specifying the major version version range. See the versioning section below.

    npm install -g toolkit
    
You can also install it locally into the node_modules folder of the current directory by using the following command:

    npm install toolkit

## Contributing
Contributions would be absolutely fantastic. Please don't hold back, I can only take it so far on my own! However there should be some formality to this especially if we have conflicting ideas.

* If you plan to make a change create an issue first and say that you plan to fix it yourself.
* I will then reply to that issue with any ideas/contributions I have.
* Submit a pull request with a commend ending in something like "Fixes #<ISSUE ID>" So that the issue is linked to the commit and will automatically close it when I pull your request.
    
Code should follow the style as the rest of the library. Soft 2-space tabs, plenty of whitespace. Re-use methods internally as much as possible - this helps avoid redundant code and is also easier to maintain. If you find yourself writing a lot of code for one small function maybe another function is needed to make it easier/more compact?

The obvious applies:

* Full test coverage of all your code.
* Do comment blocks for all your functions. Include an example and parameter descriptions.

> Note: Never touch /docs/ everything here is generated automatically.

As always your name will be added to a contributors list and forever praised.

Peace x

## License
(The MIT License)

Copyright (c) 2011 Oliver Morgan <oliver.morgan@kohark.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.