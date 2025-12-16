const _ = require("underscore");


function calculate(age) {
    let map = input.split('\n').map(a => a.split(""))

    // This assumes the first column and first row are not empty,
    // but even if that were the case, it wouldn't affect the distance between
    // the galaxies, since by definition there are no galaxies before the first row or column
    let verticalExpansion = [0];
    let horizontalExpansion = [0];

    for(let i = 1; i < map.length; ++i) {
        let res = verticalExpansion[i-1];
        if(map[i].indexOf("#") == -1) {
            res += age;
        }
        verticalExpansion[i] = res;
    }

    for(let i = 1; i < map[0].length; ++i) {
        let res = horizontalExpansion[i-1];
        if(_.every(map, row => row[i] == ".")) {
            res += age;
        }
        horizontalExpansion[i] = res;
    }

    let galaxies = new Set();
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[0].length; ++j) {
            if(map[i][j] == "#") {
                galaxies.add(`${j}_${i}`);
            }
        }
    }

    let sum = 0;
    for(const galaxy1 of galaxies) {
        const [x1, y1] = galaxy1.split("_").map(Number);
        for(const galaxy2 of galaxies) {
            const [x2, y2] = galaxy2.split("_").map(Number);

            if((x2 > x1 || (x1 == x2 && y2 > y1)) && !(x1 == x2 && y1 == y2)) {
                let realx1 = x1 + horizontalExpansion[x1];
                let realx2 = x2 + horizontalExpansion[x2];
                let realy1 = y1 + verticalExpansion[y1];
                let realy2 = y2 + verticalExpansion[y2];

                sum += (realx2 - realx1) + Math.abs(realy2 - realy1);
            }
        } 
    }

    return sum;
}

function part1() {
    return calculate(1);
}

function part2() {
    return calculate(999999);
}


var input = require("../input/2023/11.cjs");

console.log(part1());
console.log(part2());
