# ECMA5 Multi-Purpose Javascript Toolkit
Documentation is at: jstoolkit.org

## Features
* Emulates ECMA5 Object features in legacy browsers. http://ejohn.org/blog/ecmascript-5-objects-and-properties/
* Over 86 native object prototypes extensions.
* Fully portable and tested on multiple platforms.

## Design Philosophy
* Written in pure optimised javascript.
* Use JST methods within JST wherever possible.
* Lightweight, fast and small. Suitable for mobile devices.

## Avoided
* Overlapping frameworks like JQuery, Prototype etc.
* Full i18n / l10n compatibility. Although 90% of JST methods are locale-independent, JST is english-only.
* Monolithic code-base and be-all-and-end-all integrated library.

## Installation and Getting Started

### Browser
If you plan to use JSToolkit in the browser it is advised that you link `jst.min.js` in a script tag in your header. You can find `jst.min.js` in the `dist/` folder of this repository or from the website jstoolkit.org and click the download button.

### Node.JS / NPM
Using JSToolkit in Node.JS is incredibly easy. Simply install the package using a simple command:

    npm install toolkit -g

And to setup the integrated methods simply put `require('toolkit')` anywhere within your script.

#### Node.JS REPL
Because of the way Node.JS's REPL works, you cannot use toolkit as you would normally so we have provided a special integrated repl that works with JSToolkit.

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

## Contributing
Please follow the following steps to contributing.

1. Check whether an issue containing your fix/feature is already open, if not create one.
2. Fork the JSToolkit repository and create a branch for fix. Like `feature/Array#foobar` or `bugfix/Array#diff`
3. Make all commits relating to your issue to that branch and once ready put it into a pull request referencing the issue.
4. Be sure to include full unit-tests for your change and ensure they pass! We use QUnit as our testing framework.

## License
(The MIT License)

Copyright (c) 2011 Oliver Morgan <oliver.morgan@kohark.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.