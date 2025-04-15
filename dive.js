/*jslint indent: 2, maxlen: 80, continue: false, unparam: false */
/* -*- tab-width: 2 -*- */
/*global define: true, module: true, require: true */
((typeof define === 'function') && define.amd ? define : function (factory) {
  'use strict';
  var m = ((typeof module === 'object') && module), e = (m && m.exports);
  if (e) { m.exports = (factory(require, e, m) || m.exports); }
})(function () {
  'use strict';
  var hop = Object.prototype.hasOwnProperty;

  return function (data, path, miss) {
    if (!path) { return data; }
    if (!Array.isArray(path)) {
      path = String(path || '');
      if (!path) { return data; }
      path = (path.match(/^[a-z0-9_]/i) ? path.split(/\./)
        : path.slice(1).split(path.substr(0, 1)));
        // NB: Using .substr instead of path[0] for MSIE6 compatibility.
    }
    if (miss === undefined) { miss = false; }
    path.forEach(function (key) {
      data = ((data === null) || (data === undefined) ? miss : data);
      data = (hop.call(data, key) ? data[key] : undefined);
    });
    return data;
  };

});
