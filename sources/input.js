const fs = require('fs');
const BUFFER_LENGTH = 256;


const input = () => {
    const stdin = fs.openSync('/dev/stdin', 'rs');
    const buffer = Buffer.alloc(BUFFER_LENGTH);
    fs.readSync(stdin, buffer, 0, BUFFER_LENGTH);
    let ret = buffer.toString().trim()
    fs.closeSync(stdin);
    return ret;
}

console.log("Hello!");
console.log(input().toString().trim().split(' ').reduce((acc, n) => acc + parseInt(n), 0));
