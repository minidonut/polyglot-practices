const { spawn } = require('child_process');



// const cp = spawn('./1000', [])
// const cp = spawn('python3', ['./1000.py'])
const cp = spawn('node', ['./1000.js']);

let result = []
// cp.stdin.setEncoding('ascii');

cp.stdout.on('data', data => {
    let x = data.toString().trim();
    if (x === '1') {
        nodeWrite('5\n');       
        nodeWrite('8\n');
    }
    result.push(data.toString().trim());
})

cp.on('close', () => {
    console.log('closed');
    console.log(result);
})

cp.stderr.on('data', data => {
    console.log(data.toString().trim());
})


const nodeWrite = x => {
    
    setTimeout(()=>{
        console.log('node write invoked with ', x);
        cp.stdin.write(x, 'utf-8');
    },100*parseInt(x))
}

// cp.stdin.write('8\n5\n');


// const { testSet } = require('./1000.test.js');

// console.log(testSet);
