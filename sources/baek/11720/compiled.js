'use strict';

var buf = require('fs').readFileSync('/dev/stdin').toString();

console.log(buf.split('\n')[1].split('').reduce(function (acc, n) {
  return acc + parseInt(n);
}, 0));
// babel example.js --out-file compiled.js
