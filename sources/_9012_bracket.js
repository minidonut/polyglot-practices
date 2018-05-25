process.stdin.setEncoding('ascii');
process.stdin.resume();

let count = -1;
let args = [];
process.stdin.on('data', function(text) {
    text = text.substring(0, text.length - 1);
    if (count == -1) {
        count = Number(text);
    }
    else {
        args.push(text);
        count--;
    }
    if (count == 0) {
        process.stdin.pause();
        main();
    }


});

function main() {
    for(let i=0; i<args.length; i++){
        bracketTest(args[i]);
    }
}

function bracketTest(_str) {
    let stack = [],
        arr = _str.split("").reverse(),
        length = arr.length;

    for (let i = 0; i < length; i++) {
        var token = arr.pop();
        if (stack.length == 0 && token == ")") {
            console.log("NO");
            return false;
        }
        if (token == "("){
            stack.push(token);
        }else{
            stack.pop();
        }
    }
    console.log(stack.length == 0 ? "YES" : "NO");
}