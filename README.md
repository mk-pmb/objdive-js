
<!--#echo json="package.json" key="name" underline="=" -->
objdive
=======
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Lookup object properties deeply.
<!--/#echo -->


API
---

### dive(data[, path[, fallback]])

If `path` is false-y or missing, returns `data`.
Otherwise, `path` is converted to a string and split into steps (details below)
and `dive()` descends into deeper levels of `data`, using each step as a
property name to lead its way.

There are two empty values in JavaScript for which property lookup will
fail: `null` and `undefined`. In case the current level is one of them,
`dive()` will instead use the `fallback`.
If `fallback` is missing or `undefined`, it defaults to `false` in order to
make any property lookup succeed (i.e. not crash) and yield `undefined`.
If you want an Error thrown instead, give `null` (see examples below).



Path syntax
-----------

Path splitting has two modes, based on the first character in `path`
(let's call it "p0"):
* If p0 is a letter (`A`..`Z`, `a`..`z`), digit (`0`..`9`) or `_`,
  steps will be split by `.`.
* Otherwise, steps will be split by p0,
  starting from the 2nd character of `path`.
* In case you intend to use non-ASCII step separators,
  keep in mind that JavaScript uses UCS-2 characters.
  If `path` begins with a high unicode character (above U+FFFF),
  it will most likely be represented as a [surrogate pair][surrog8],
  so p0 will be an unpaired high surrogate character.



Usage
-----

from [test/usage.js](test/usage.js):

<!--#include file="test/usage.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="71" -->
```javascript
var dive = require('objdive'), x = {
  '': { empty: 'key' },
  foo: 42,
  bar: {
    baz: 23,
    qux: [ 'hello', 'world', 'how', 'are', 'you?' ],
    './|': true
  },
  'bar.baz': 9999,
  'bar.qux': [ 0.1, 0.2, 0.3, 0.4 ],
  '::.@': { hi: 'hello' }
};

equal(dive(x),      x);
equal(dive(x, ''),  x);

equal(dive(x, 'foo'),         x.foo);
equal(dive(x, 'foo.bar'),     x.foo.bar);
equal(dive(x, 'bar'),         x.bar);
equal(dive(x, 'bar.baz'),     x.bar.baz);
equal(dive(x, 'bar.qux.2'),   x.bar.qux[2]);

equal(dive(x, '.bar.baz'),    x.bar.baz);
equal(dive(x, '/bar/baz'),    x.bar.baz);
equal(dive(x, ':bar:baz'),    x.bar.baz);
equal(dive(x, '|bar|qux|2'),  x.bar.qux[2]);
equal(dive(x, '/bar.baz'),    x['bar.baz']);
equal(dive(x, '/bar.qux/2'),  x['bar.qux'][2]);

equal(dive(x, '.'),           x['']);
equal(dive(x, '@'),           x['']);
equal(dive(x, '@bar@./|'),    x.bar['./|']);
equal(dive(x, '?::.@?hi'),    x['::.@'].hi);

equal(dive(x, '.no.such.key'),    undefined);
equal(dive(x, '.toString'),       undefined);
equal(dive(x, '.hasOwnProperty'), undefined);
// Prefer a crash?
fails(function () { dive(x, '.no.such.key', null); },
  /^TypeError: [\S\s]+ null\b/);

// You can also use fancier defaults:
function fancy(path) { return dive(x, path, fancy.fallbackObj); }
fancy.fallbackObj = {
  '': 'index.html',
  '?limit': 9000,
  crash: null
};

equal(fancy('/'),           x['']);
equal(fancy('/foo'),        x.foo);
equal(fancy('/foo/bar'),    undefined);
equal(fancy('/foo/bar/'),   'index.html');
equal(fancy('/foo/?limit'), undefined);
equal(fancy('/foo/?limit'), x.foo['?limit']);
equal(fancy('/404'),        undefined);
equal(fancy('/404/'),       'index.html');
equal(fancy('/404/?limit'), 9000);
equal(fancy('/404/crash'),        null);
equal(fancy('/404/crash/noes'),   undefined);

// You can also give paths as array to avoid auto-split:
equal(dive(x, ['foo']),               x.foo);
equal(dive(x, ['foo', 'bar']),        x.foo.bar);
equal(dive(x, ['foo.bar']),           undefined);
equal(dive(x, ['bar', 'qux', '2']),   x.bar.qux[2]);
equal(dive(x, ['bar', 'qux', 2]),     x.bar.qux[2]);
equal(dive(x, ['bar.qux', 2]),        x['bar.qux'][2]);
equal(dive(x, ['bar', 'qux.2']),      undefined);
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* Versions before 0.1.3 had a flawed fallback implementation that would
  return methods of `false` for some keys.



&nbsp;

  [surrog8]: https://www.npmjs.com/package/surrog8

License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
