function isInvalid(test, factor) {
    const str = test.toString();
    if(str.length % factor !== 0) { return false; }

    for(let i = 0; i < factor; ++i) {
        for(let j = i; j < str.length; j+=factor) {
            if(str[i] !== str[j]) {
                return false;
            }
        }
    }
    return true;
}

function solve1() {
    // Quick test showed I have 2533508 inputs to check, so I'm just going to brute force it
    // Will probably need to redo for part 2 lol
    return input.split(",")
        .map(a=>a.split("-").map(Number))
        .map(([start,end])=> {
            let invalid = 0;
            for(let i = start; i <= end; ++i) {
                if(isInvalid(i, i.toString().length/2)) {
                    invalid += i;
                }
            }
            return invalid;
        })
        .reduce(sum, 0)
}

function solve2() {
    return input.split(",")
        .map(a=>a.split("-").map(Number))
        .map(([start,end])=> {
            let invalid = 0;
            for(let i = start; i <= end; ++i) {
                for(let factor = 1; factor <= i.toString().length/2; ++factor) {
                    if(isInvalid(i, factor)) {
                        invalid += i;
                        break;
                    }
                }
            }
            return invalid;
        })
        .reduce(sum, 0)
}
const input = require("../input/2025/02.cjs");
const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

console.log(solve1());
console.log(solve2());
