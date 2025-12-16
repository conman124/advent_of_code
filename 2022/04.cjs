const sum = require("../sum.cjs");

function countOverlap(callback) {
    return input.split('\n')
        .map(a=>a.split(/[-,]/))
        .map(a=>a.map(Number))
        .map(callback)
        .reduce(sum)
}

function fullOverlap([a, b, c, d]) {
    return a >= c && b <= d || a <= c && b >= d;
}

function part1() {
    return countOverlap(fullOverlap);
}

function part2() {
    function partialOverlap([a, b, c, d]) {
        return a <= c && b >= c || a <= d && b >= d || fullOverlap([a,b,c,d]);
    }

    return countOverlap(partialOverlap);
}

const input = require('../input/2022/04.cjs');

console.log(part1());
console.log(part2());
