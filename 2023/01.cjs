const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

function solve1() {
    return input.split("\n")
        .map(a => {let match = a.match(/\d/g); return match[0] + match.pop(); } )
        .map(Number)
        .reduce(sum);
}

function solve2() {
    const nums = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

    function toNum(str) {
        const ret = nums.indexOf(str);
        if(ret == -1) { return parseInt(str); }
        return ret + 1;
    }

    function overlappingMatch(str, regex) {
        let matches = [];
        let match;
        while(match = regex.exec(str)) {
            matches.push(match[0]);
            regex.lastIndex -= match[0].length-1;
        }
        return matches;
    }

    const regex = new RegExp(`\\d|${nums.join("|")}`, 'g');

    return input.split("\n")
        .map(a => {regex.lastIndex = 0; let match = overlappingMatch(a, regex); return "" + toNum(match[0]) + toNum(match.pop()); } )
        .map(toNum)
        .reduce(sum);

}

const input = require("../input/2023/01.cjs");

console.log(solve1());
console.log(solve2());
