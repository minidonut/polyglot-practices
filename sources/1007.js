const fs = require('fs');

// small because I'm only reading a few bytes
const BUFFER_LENGTH = 256;

const stdin = fs.openSync('/dev/stdin', 'rs');
const buffer = Buffer.alloc(BUFFER_LENGTH);

fs.readSync(stdin, buffer, 0, BUFFER_LENGTH);
console.log('[', buffer.toString().trim().split(' '), ']');
fs.closeSync(stdin);