# ECMA5 Multi-Purpose Javascript Toolkit

## Using Toolkit in Node.JS REPL
If you want to dive straight into testing some of JST's features in REPL, as of 1.5.0 this is now supported. The main package exports a method called `repl` to use it simply type the following into a new repl window:

    $ node
    > require('toolkit').repl();
    toolkit> Array.range(1,9,3);
    [ 1, 4, 7 ]
    
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