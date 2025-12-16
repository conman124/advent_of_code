const tee = require('../tee.cjs');
const sum = require('../sum.cjs');
const _ = require("underscore")

function calculate(input) {
    return input.split("\n")
        .map((line,i) => {
            const [springs, groups] = line.split(" ");

            /**
             * 
             * @param {string} springs 
             * @param {number[]} groups 
             * @returns 
             */
            function recurse_(springs, groups) {
                debugger;

                // Don't care about any functioning ones at the beginning
                springs = springs.replace(/^\.*/, "");

                // Everything is consumed, this was a good path
                if(springs.length == 0 && groups.length == 0) {
                    return 1;
                }
                // We have some extra groups that don't have any more possible broken springs available
                if(springs.length == 0) {
                    return 0;
                }
                if(groups.length == 0) {
                    if(springs.indexOf('#') == -1) {
                        // There are no more groups, and all the remaining springs are either working or indefinite
                        return 1;
                    } else {
                        // We have no more groups, but there's at least one more broken spring
                        return 0;
                    }
                }

                if(springs[0] == '#') {
                    // We have to eat the next group:
                    let eat = groups[0];
                    if(eat > springs.length) {
                        return 0;
                    }
                    for(let i = 0; i < eat; ++i) {
                        if(springs[i] == ".") {
                            return 0;
                        }
                    }
                    if(springs[eat] == '#') {
                        return 0;
                    }

                    return recurse(springs.substring(eat+1), groups.slice(1));
                } else {
                    // it is a question mark, so check if it is possible to eat the next group:
                    let canEat = true;
                    let eat = groups[0];
                    if(eat > springs.length) {
                        canEat = false;
                    }
                    for(let i = 0; i < eat; ++i) {
                        if(springs[i] == ".") {
                            canEat = false;
                        }
                    }
                    if(springs[eat] == '#') {
                        canEat = false;
                    }

                    let ret = 0;
                    if(canEat) {
                        ret += recurse(springs.substring(eat+1), groups.slice(1));
                    }

                    // Now assume this one is working and recurse:
                    ret += recurse(springs.substring(1), groups);

                    return ret;
                }
            }

            const recurse = _.memoize(recurse_, (a,b) => `${a}___${b.join('_')}`);

            return recurse(springs, groups.split(",").map(Number));
        })
        .reduce(sum);
}

function part1() {
    return calculate(input)
}

function part2() {
    return calculate(input.replace(/^([^ ]*) (.*)$/gm, "$1?$1?$1?$1?$1 $2,$2,$2,$2,$2"));
}

var input = require("../input/2023/12.cjs");

console.log(part1());
console.log(part2());
