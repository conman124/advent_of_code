const _ = require("underscore");
const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

function getNumberAndBorderingPoints(grid, i, j) {
    const begin = j;

    let num = grid[i][j];
    while(++j && j < grid[0].length && grid[i][j].match(/[0-9]/)) {
        num += grid[i][j];
    }

    const borderingPoints = [];
    for(let k = begin-1; k <= j; ++k) {
        borderingPoints.push([i-1, k]);
        borderingPoints.push([i+1, k]);
    }
    borderingPoints.push([i, begin-1]);
    borderingPoints.push([i, j]);

    return [{num: parseInt(num), borderingPoints}, j];
}

function part1() {
    function* possibleParts(grid) {
        for(let i = 0; i < grid.length; ++i) {
            for(let j = 0; j < grid[0].length; /* incremented in loop */ ) {
                if(grid[i][j].match(/[0-9]/)) {
                    let res = getNumberAndBorderingPoints(grid, i, j);
                    j = res[1];
                    yield res[0];
                } else {
                    ++j;
                }
            }
        }
    }

    const grid = input.split('\n').map(a => a.split(''));

    function isSymbol([x, y]) {
        if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
            return false;
        }

        return !grid[x][y].match(/[0-9.]/);
    }

    function isEnginePart(part) {
        return _.any(part.borderingPoints, isSymbol);
    }


    return [...possibleParts(grid)]
        .filter(isEnginePart)
        .map(a => a.num)
        .reduce(sum);
}

function part2() {
    const grid = input.split('\n').map(a => a.split(''));

    function getPartNumber(x, y) {
        // this is so ugly, but I want these to be easily deduped

        if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
            return ""; // return something falsey
        }

        if(!grid[x][y].match(/[0-9]/)) {
            return "";
        }

        while(--y >= 0 && grid[x][y].match(/[0-9]/));
        ++y;

        let [{num}] = getNumberAndBorderingPoints(grid, x, y);
        return `${x}_${y}_${num}`;
    }

    function calculateGearRatio(x, y) {
        let adjNumbers = new Set();
        for(const [i,j] of [[x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y], [x+1, y], [x-1, y+1], [x, y+1], [x+1, y+1]]) {
            let res = getPartNumber(i, j);
            if(res) { adjNumbers.add(res); }
        }
        if(adjNumbers.size != 2) {
            return 0;
        }
        let num = [...adjNumbers];
        return num[0].split('_').pop()*num[1].split('_').pop();
    }

    let sum = 0;

    for(let i = 0; i < grid.length; ++i) {
        for(let j = 0; j < grid[0].length; ++j) {
            if(grid[i][j] == "*") {
                sum += calculateGearRatio(i, j);
            }
        }
    }

    return sum;
}

var input = require("../input/2023/03.cjs");

console.log(part1());
console.log(part2());
