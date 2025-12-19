function maxJoltage(bank, length) {
    const indices = Array(length);
    indices[0] = 0;
    for(let i = 0; i < length; ++i) {
        for(let j = indices[i]; j < bank.length - (length - i - 1); ++j) {
            if(bank[j] > bank[indices[i]]) {
                indices[i] = j;
            }
        }
        if(i < length - 1) {
            indices[i+1] = indices[i]+1;
        }
        //console.log(indices);
    }

    return Number(indices.map(i => bank[i]).join(""));
}

function solve1() {
    return input.split("\n")
        .map(a => a.split("").map(Number))
        .map(bank => maxJoltage(bank, 2))
        .reduce(sum);
}

function solve2() {
    return input.split("\n")
        .map(a => a.split("").map(Number))
        .map(bank => maxJoltage(bank, 12))
        .reduce(sum);

}

const input = require("../input/2025/03.cjs");
const sum = require("../sum.cjs");

console.log(solve1());
console.log(solve2());
