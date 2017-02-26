/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
require('fs').writeFile('objdive.amd.min.js',
  require('uglify-js').minify(require('read-resolved-file-sync')(require)('./'
    ).replace(/^[\S\s]+?\}\)/, 'define'), { fromString: true }).code + '\n');
