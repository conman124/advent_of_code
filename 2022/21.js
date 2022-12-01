const _ = require('underscore');

const resolve = _.memoize(function(name, parsed) {
    if(_.isNumber(parsed[name])) {
        return parsed[name];
    }

    let obj = parsed[name];
    let operand1 = resolve(obj.operand1, parsed);
    let operand2 = resolve(obj.operand2, parsed);
    return obj.op(operand1, operand2);
})

function part1() {
    let parsed = {};
    input.split('\n').forEach(line => {
        let match = line.match(/(....): ((\d+)|(....) (.) (....))/);
        let name = match[1];
        if(match[3]) {
            parsed[name] = parseInt(match[3])
        } else {
            let op;
            switch(match[5]) {
                case "+": op = (a,b)=>a+b; break;
                case "/": op = (a,b)=>a/b; break;
                case "-": op = (a,b)=>a-b; break;
                case "*": op = (a,b)=>a*b; break;
                default: throw new Error("unrecognized operation")
            }
            let operand1 = match[4];
            let operand2 = match[6];

            parsed[name] = {op, operand1, operand2};
        }
    });

    return resolve("root", parsed);
}

const print = _.memoize(function(name, parsed) {
    let obj = parsed[name];
    if(obj.operand1 && obj.operand2) {
        let left = print(obj.operand1, parsed);
        let right = print(obj.operand2, parsed);
        return obj.print(left, right);
    }
    return obj.print();
})

function part2() {
    let parsed = {};
    input.split('\n').forEach(line => {
        let match = line.match(/(....): ((\d+)|(....) (.) (....))/);
        let name = match[1];
        if(name == "root") {
            parsed[name] = {
                print: (a,b) => `Eq(${a}, ${b})`,
                operand1: match[4],
                operand2: match[6],
            };
        } else if (name == "humn") {
            parsed[name] = {
                print: () => `humn`
            };
        } else if (match[3]) {
            parsed[name] = {
                print: () => `${match[3]}`
            };
        } else {
            parsed[name] = {
                print: (a,b) => `(${a} ${match[5]} ${b})`,
                operand1: match[4],
                operand2: match[6]
            };
        }
    });   

    return `To solve part 2, put the following into python3 with sympy installed:

from sympy import *
humn = symbols("humn")
simplify(${print("root", parsed)})`
}

const input = require('../input/2022/21.js');

console.log(part1());
console.log(part2());
