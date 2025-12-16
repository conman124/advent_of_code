const _ = require("underscore")

function calculateValues() {
    let values = [undefined, 1];
    
    let commands = input.split('\n');
    for(let i = 0; i < commands.length; ++i) {
        if(commands[i][0] == "n") {
            values.push(_.last(values));
        } else if(commands[i][0] == "a") {
            values.push(_.last(values));
            values.push(_.last(values) + parseInt(commands[i].split(' ')[1]));
        } else {
            throw new Error("bad command");
        }
    }
    
    return values;
}

function part1() {
    let values = calculateValues();

    return 20 * values[20] + 60 * values[60] + 100 * values[100] + 140 * values[140] + 180 * values[180] + 220 * values[220];
}

function part2() {
    let values = calculateValues();

    let ret = [];
    for(let i = 0; i < 6; ++i) {
        ret[i] = new Array(40);
        ret[i].fill(" ");
    }

    for(let y = 0; y < 6; ++y) {
        for(let x = 0; x < 40; ++x) {
            let index = y * 40 + x + 1;
            if([x-1, x, x+1].includes(values[index])) {
                ret[y][x] = '#';
            }
        }
    }

    return ret.map(a=>a.join('')).join('\n');
}

const input = require('../input/2022/10.cjs');

console.log(part1());
console.log(part2());
