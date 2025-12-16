const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

function calculate(findReflectionPoint) {
    function transpose(str) {
        let arr = str.split("\n");
        let ret = new Array(arr[0].length).fill(0).map(_ => new Array(arr.length));
        for(let i = 0; i < arr.length; ++i) {
            for(let j = 0; j < arr[0].length; ++j) {
                ret[j][i] = arr[i][j];
            }
        }
        return ret.map(a=>a.join("")).join("\n");
    }

    return input.split("\n\n")
        .map(a => {
            return 100 * findReflectionPoint(a) + findReflectionPoint(transpose(a));
        })
        .reduce(sum)
}

function part1() {
    function findReflectionPoint(str) {
        let arr = str.split("\n");

        for(let i = 1; i < arr.length; ++i) {
            let count = Math.min(i, arr.length-i);
            let reflection = true;
            for(let j = 0; j < count; ++j) {
                if(arr[i-j-1] !== arr[i+j]) {
                    reflection = false;
                    break;
                }
            }
            if(reflection) {
                return i;
            }
        }

        return 0;
    }

    return calculate(findReflectionPoint);
}

function part2() {
    function findReflectionPointWithSmudge(str) {
        let arr = str.split("\n");

        for(let i = 1; i < arr.length; ++i) {
            let count = Math.min(i, arr.length-i);
            let reflection = true;
            let smudges = 0;

checkReflection:
            for(let j = 0; j < count; ++j) {
                for(let k = 0; k < arr[0].length; ++k) {
                    if(arr[i-j-1][k] !== arr[i+j][k]) {
                        ++smudges
                    }
                    if(smudges > 1) {
                        reflection = false;
                        break checkReflection;
                    }
                }
            }
            if(smudges != 1) {
                reflection = false;
            }
            if(reflection) {
                return i;
            }
        }

        return 0;
    }

    return calculate(findReflectionPointWithSmudge);

}

var input = require("../input/2023/13.cjs")

console.log(part1());
console.log(part2());
