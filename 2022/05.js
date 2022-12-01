const _ = require('underscore');
const sum = require('../sum');

function rearrangeCrates(callback) {
    const [initial, instructions] = input.split('\n\n');

    let initialLines = initial.split('\n');
    let stackCount = (initialLines[0].length + 1) / 4;
    let stacks = new Array(stackCount);

    for(let i = 0; i < stackCount; ++i) {
        stacks[i] = [];
    }

    for(let i = 0; i < initialLines.length - 1; ++i) {
        let matches = initialLines[i].matchAll(/((   |\[([A-Z])\])( |$))/g);
        matches = [...matches];
        for(let j = 0; j < matches.length; ++j) {
            if(matches[j][3]) {
                stacks[j].push(matches[j][3]);
            }
        }
    }

    stacks.map(a=>a.reverse());

    let instructionLines = instructions.split('\n');
    instructionLines.forEach(line => {
        let [_fullmatch, count, fromStack, toStack] = line.match(/move (\d+) from (\d+) to (\d+)/);
        count = parseInt(count);
        fromStack = parseInt(fromStack) - 1;
        toStack = parseInt(toStack) - 1;

        callback(count, fromStack, toStack, stacks);
    });

    return stacks.map(_.last).reduce(sum);

}

function part1() {
    function cratemover9000(count, fromStack, toStack, stacks) {
        for(let i = 0; i < count; ++i) {
            stacks[toStack].push(stacks[fromStack].pop());
        }    
    }

    return rearrangeCrates(cratemover9000);
}

function part2() {
    function cratemover9001(count, fromStack, toStack, stacks) {
        // Feeling a little lazy
        let tmp = [];

        for(let i = 0; i < count; ++i) {
            tmp.push(stacks[fromStack].pop());
        }    

        for(let i = 0; i < count; ++i) {
            stacks[toStack].push(tmp.pop());
        }
    }

    return rearrangeCrates(cratemover9001);
}

const input = require("../input/2022/05.js");

console.log(part1());
console.log(part2());
