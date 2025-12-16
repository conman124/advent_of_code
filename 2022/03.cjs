const _ = require('underscore');
const sum = require('../sum.cjs');

function letterToCode(char) {
    let a = "a".charCodeAt(0);
    let A = "A".charCodeAt(0);
    let code = char.charCodeAt(0);

    if(code < A + 26) {
        return code - A + 1 + 26 ;
    } else {
        return code - a + 1;
    }
}

function part1() {
    function processSingle(line) {
        let half1 = new Set(line.slice(0, line.length / 2).split(''));

        for(let i = line.length / 2; i < line.length; ++i) {
            if(half1.has(line[i])) {
                return letterToCode(line[i]);
            }
        }
    }

    return input.split('\n').map(processSingle).reduce(sum);
}

function part2() {
    return _.chunk(input.split("\n"), 3)
        .map(a => letterToCode(_.intersection(
            a[0].split(''), 
            a[1].split(''),
            a[2].split('')
        )[0])
        ).reduce(sum);
}

const input=require("../input/2022/03.cjs");

console.log(part1());
console.log(part2());
