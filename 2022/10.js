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

const input = `noop
addx 5
addx -2
noop
noop
addx 7
addx 15
addx -14
addx 2
addx 7
noop
addx -2
noop
addx 3
addx 4
noop
noop
addx 5
noop
noop
addx 1
addx 2
addx 5
addx -40
noop
addx 5
addx 2
addx 15
noop
addx -10
addx 3
noop
addx 2
addx -15
addx 20
addx -2
addx 2
addx 5
addx 3
addx -2
noop
noop
noop
addx 5
addx 2
addx 5
addx -38
addx 3
noop
addx 2
addx 5
noop
noop
addx -2
addx 5
addx 2
addx -2
noop
addx 7
noop
addx 10
addx -5
noop
noop
noop
addx -15
addx 22
addx 3
noop
noop
addx 2
addx -37
noop
noop
addx 13
addx -10
noop
addx -5
addx 10
addx 5
addx 2
addx -6
addx 11
addx -2
addx 2
addx 5
addx 3
noop
addx 3
addx -2
noop
addx 6
addx -22
addx 23
addx -38
noop
addx 7
noop
addx 5
noop
noop
noop
addx 9
addx -8
addx 2
addx 7
noop
noop
addx 2
addx -4
addx 5
addx 5
addx 2
addx -26
addx 31
noop
addx 3
noop
addx -40
addx 7
noop
noop
noop
noop
addx 2
addx 4
noop
addx -1
addx 5
noop
addx 1
noop
addx 2
addx 5
addx 2
noop
noop
noop
addx 5
addx 1
noop
addx 4
addx 3
noop
addx -24
noop`;

console.log(part1());
console.log(part2());
