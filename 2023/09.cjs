const _ = require("underscore");
const sum = require("../sum.cjs");

function calculate(elFn, combineFn) {
    function extrapolate(arr) {
        if(_.every(arr, a => (a==0))) {
            return 0;
        }

        let diffs = [];
        for(let i = 1; i < arr.length; ++i) {
            diffs.push(arr[i] - arr[i-1]);
        }

        return combineFn(extrapolate(diffs), elFn(arr));
    }

    return input.split("\n")
        .map(a => a.split(" ").map(Number))
        .map(extrapolate)
        .reduce(sum)
}

function part1() {
    return calculate(_.last, (a,b) => a+b)
}

function part2() {
    return calculate(_.first, (a,b) => b-a);
}

const input = require("../input/2023/09.cjs");

console.log(part1());
console.log(part2());
