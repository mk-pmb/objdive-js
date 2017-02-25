/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function readmeDemo(equal) {
  equal = require('assert').deepStrictEqual;
  function catchStr(f) { try { f(); } catch (err) { return String(err); } }
  function fails(f, rx) {
    var e = catchStr(f);
    if (!e.match(rx)) { equal(e, rx); }
  }

  //#u
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
  //#r

  console.log("+OK usage test passed.");    //= "+OK usage test passed."
}








(function (e) {
  /*global define: true */
  var d = ((typeof define === 'function') && define),
    m = ((typeof module === 'object') && module);
  if (d && d.amd) { d(function () { return e; }); }
  if (m && m.exports) { m.exports = e; }
}(readmeDemo));
