const { spawn } = require('child_process');



// const cp = spawn('./1000', [])
// const cp = spawn('python3', ['./1000.py'])
const cp = spawn('node', ['./1001.js']);

let result = []
// cp.stdin.setEncoding('ascii');

cp.stdout.on('data', data => {
    console.log(data.toString().trim());
    result.push(data.toString().trim());
})

cp.on('close', () => {
    console.log('closed');
    console.log(result);
})

cp.stderr.on('data', data => {
    console.log(data.toString().trim());
})


setTimeout(() => {
    cp.stdin.write('8\n5\n');
    cp.stdin.write('5\n');
    console.log('stdin start');
}, 1000);



// const { testSet } = require('./1000.test.js');

// console.log(testSet);
