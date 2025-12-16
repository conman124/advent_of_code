const _ = require("underscore");
const tee = require("../tee.cjs");

function getMargin([ms, distance]) {
    let min, max;
    for(min = 0; min < ms; ++min) {
        if((ms-min) * min > distance) {
            break;
        }
    }

    for(max = ms; max >= 0; --max) {
        if((ms-max) * max > distance) {
            break;
        }
    }
    ++max;
    
    return max - min;
}

function part1() {
    return _.zip.apply(null, 
        input.split('\n')
            .map(a => 
                a.split(/: +/)[1].split(/ +/).map(Number)
            )
        )
        .map(getMargin)
        .reduce((a,b)=>a*b, 1);
}

function part2() {
    return _.zip.apply(null,
        input.split('\n')
            .map(a => 
                [Number(a.split(/: +/)[1].replace(/ +/g, ''))]
            )
        )
        .map(getMargin)[0];
}

const input = require("../input/2023/06.cjs");

console.log(part1());
console.log(part2());
