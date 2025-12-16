function findMarker(input, len) {
    for(let i = 0; i <= input.length - len; ++i) {
        if(new Set(input.slice(i, i+len).split('')).size == len) {
            return i + len;
        }
    }
}

function part1() {
    return findMarker(input, 4);
}

function part2() {
    return findMarker(input, 14);
}

const input = require('../input/2022/06.cjs');

console.log(part1());
console.log(part2());
