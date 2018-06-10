#!/usr/bin/node

const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const { spawn } = require('child_process');
const rm = fs.unlink;
const output = [];

const JS_TEST = 2;
const TEST_MODE = 1;
const RUN_MODE = 0;

const env = {
    src: null,
    bin: null,
    lang: null,
    name: null,
    dir: null,
};

program
    .version('0.1.0')
    .arguments('<src>')
    .action((src) => {
        env.src = src;
    })
    .option('-s, --save', 'append logs into source file as comment')
    .option('-b, --branch', 'branch source')
    .option('-v, --ver [ver]', 'run version as [ver]')
    .option('-a, --arg [arg...]', 'custom args')
    .option('-t --test', 'width testcase')
    .parse(process.argv);

if (typeof env.src === 'undefined') {
    console.error(chalk.red('ERROR: ') + 'no program given!');
    console.error('USAGE: $ node index <program> [options..]');
    process.exit(1);
}
// if (program.save) console.log(' save');
// if (program.branch) console.log(' brach');
// if (program.ver) console.log(` ${program.ver} version`);
// if (program.args) console.log(`args:  ${program.args} `);
// if (program.test) console.log('run test suite');

// console.log(program.args);
// console.log(program.arg, program.ver);
// console.log(sourceName);


// const commander = require('commander');



// chalk wrapper
const blue = x => chalk.bold.rgb(10, 88, 200)(x);


// const child = spawn('node', ['sample']);

// child.stdout.on('data', (data)=>{
//     console.log(data.toString());
// })


// child.on('close', ()=>{
//     console.log('childprocess closed');
// })


// child.stdin.write("Hello world!")
// child.stdin.write("Hello world!")


// const compile = lang => 

const source = sourceName => {
    let arr = sourceName.trim().split('.');
    env.name = arr[0];
    env.lang = arr[1];
}



const execute = (MODE, testSources) => {
    
    
    if(MODE === JS_TEST){
        const testName = testSources[0].slice(7);
        const testCode =  fs.readFileSync('compiled.js').toString().replace('/dev/stdin', env.dir+testSources[0].slice(1));
        fs.writeFileSync(testName+env.src, testCode);
        env.bin = testName+env.src;
    }
    
    const child = (env.lang === 'py') ? spawn('python3', [env.bin]) :
        (env.lang === 'js') ? spawn('node', [env.bin]) : spawn(env.bin, []);

    child.stdout.on('data', data => {
        output.push(data.toString());
    })
    
    child.on('close', () => {
        if(MODE === JS_TEST){
            rm(env.bin, (err) => { if (err) throw err });
        }
        if (testSources[1] === null) {
            exitHander(MODE);
        }
        else {
            execute(MODE, testSources[1]);
        }
    })

    child.on('error', (err) => {
        console.log(`Failed to start subprocess by ${err}`);
    });

    if ((MODE === TEST_MODE) || (MODE  === JS_TEST)) {

        const inputTxt =  fs.readFileSync(testSources[0]).toString();
        const solutionTxt = fs.readFileSync(testSources[0]+'.sol').toString();
        
        output.push(chalk.green(`----------------- ${testSources[0].slice(7)}`))
        
        output.push(chalk.red('input: '));
        output.push(inputTxt);
        output.push(chalk.red('expected: '));
        output.push(solutionTxt);
        output.push(chalk.red('\nresult: '));
        
        
        child.stdin.write(inputTxt);
    }
    

    return child;
    
    
}

const start = () => {
    console.log(chalk.red('executing ') + `${env.bin} \n`);
    const child = execute(RUN_MODE, [null, null]);

    process.stdin.on('data', (data) => {
        child.stdin.write(data.toString());
    })

    process.stdin.resume();
}

const start_test = () => {
    if (!fs.readdirSync(env.dir).includes('test')) {
        console.log(chalk.red('ERROR: ') + 'test directory is not found!');
        process.exit(1);
    }
    const testSet = fs.readdirSync(env.dir + '/test');
    const inputSrc = testSet.filter(x => x.indexOf('sol') < 0).sort();


    const children = inputSrc.reduce((acc, n) => [`./test/${n}`, acc], null);

    if (env.lang === 'js') {
        execute(JS_TEST, children);
    }
    else {
        execute(TEST_MODE, children)
    }
}


const exitHander = (MODE) => {
    
        exit();


}

const exit = () => {
    output.forEach(x => { console.log(x) });

    console.log(env.src + chalk.red(` executed`));

    if (['c', 'cpp', 'hs'].includes(env.lang)) {
        rm(env.bin, (err) => { if (err) throw err })
    }
    process.exit(0);
}



const compile = (callback) => {


    let compileProcess = (env.lang === 'hs') ? spawn('ghc', ['--make', env.src, '-o', env.name]) :
        (env.lang === 'cpp') ? spawn('g++', ['-o', env.name, env.src]) :
        (env.lang === 'c') ? spawn('gcc', ['-o', env.name, env.src]) :
        (env.lang === 'js') ? spawn('babel', [env.src, '--out-file', 'compiled.js']) : undefined;


    if (compileProcess === undefined) {
        env.bin = './' + env.src;
        callback();
        return;
    }

    compileProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    compileProcess.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });

    compileProcess.on('close', () => {

        const ls = fs.readdirSync(env.dir)
        const tempFiles = ls
            .filter(str => (str.indexOf(env.name) > -1))
            .map(x => x.split('.'))
            .filter(arr => arr.includes('hi') ||
                arr.includes('o'))
            .map(x => x.join('.'));

        tempFiles.forEach((files) => { rm(files, (err) => { if (err) throw err }) });

        if (['hs', 'c', 'cpp'].includes(env.lang)) {
            if (!ls.includes(env.name)) {
                console.log(blue(env.src) + chalk.red(` compilation failed!`));
                process.exit(1);
            }
            else {
                env.bin = './' + env.name;
            }
        }
        else if (env.lang === 'js') {
            env.bin = './compiled.js';
        }
        else {
            env.bin = './' + env.src;
        }
        console.log(blue(env.src) + chalk.red(` compiled!`));
        callback();

    });
}


// compileHS(source('helloworld.hs'));

// findpath :: (String source, String dir) => source -> dir | undefined
const findpath = source => {
    const walk = (dir, src) => {
        let list = fs.readdirSync(dir);
        if (list.includes(src)) {
            return dir;
        }
        else {
            let result = undefined;
            for (let i = 0; i < list.length; i++) {

                let next = `${dir}/${list[i]}`;
                let stat = fs.statSync(next);

                if (stat && stat.isDirectory()) {
                    result = walk(next, src) || undefined;
                    if (result !== undefined) break;
                }
            }
            return result;
        }
    }
    return walk(__dirname + '/sources', source);
}

// noSuchFile :: (String file) => file -> IO ()


const noSuchFile = file => {
    console.error(chalk.red('ERROR: '), `cannot find "${file}"`);
    process.exit(1);
}



const run = () => {

    if (['hs', 'c', 'cpp', 'js', 'py'].includes(env.lang)) {
        compile((program.test === undefined) ? start : start_test);
    }
    else {
        console.log(chalk.red('ERROR: '), 'not supported language');
        program.exit(1);
    }
}




const __main__ = () => {

    env.dir = findpath(env.src) || noSuchFile(env.src);
    source(env.src);

    console.log(`cd ${env.dir}`);
    process.chdir(env.dir);

    run();

}


// console.log(walk(__dirname+'/sources'));

// process.chdir(__dirname+'/sources/helloworld');
// console.log(`change working directory to ` + blue(`${process.cwd()}`));
// compileHS(source('helloworld.hs'));
__main__();


// main -> findpath -> run -> compile -> execute ->
