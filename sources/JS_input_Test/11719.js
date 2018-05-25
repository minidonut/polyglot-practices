// console.log(require('fs').readFileSync('./sources/11719.test')+'')

// const buf = require('fs').readFileSync('/dev/stdin').toString();

const buf = require('fs').readFileSync('./test2').toString();

console.log(buf.split('\n'));  // [ '정 a b c', '2', '3', '5', '23' ]