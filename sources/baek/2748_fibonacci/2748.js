const buf = require('fs').readFileSync('/dev/stdin').toString();

const input = parseInt(buf);

const fiboTable = new Array(91);

fiboTable[0] = 0;
fiboTable[1] = 1;

if (input >= 2) {
    for (let i = 2; i <= input; i++) {
        fiboTable[i] = fiboTable[i-1] + fiboTable[i-2];
    }
}

console.log(fiboTable[input]);
