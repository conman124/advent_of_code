import input from "../input/2025/07.js";
import memoize from "../memoize.js";

function solve1() {
    const grid = input.split("\n").map(a => a.split(""));
    let curCols = new Set([grid[0].indexOf("S")]);
    let nextCols = new Set();
    let curRow = 0;
    let splits = 0;

    for(; curRow < grid.length; ++curRow) {
        curCols.forEach(col => {
            if(grid[curRow][col] == "^") {
                ++splits;
                nextCols.add(col-1);
                nextCols.add(col+1);
            } else {
                nextCols.add(col);
            }
        });
        curCols = nextCols;
        nextCols = new Set();
    }
    return splits;
}

function solve2() {
    const grid = input.split("\n").map(a => a.split(""));

    function simulateTachyon(row, col) {
        if(row >= grid.length) {
            return 1;
        }

        if(grid[row][col] == "^") {
            return memoizedSimulateTachyon(row+1, col-1) + memoizedSimulateTachyon(row+1, col+1);
        } else {
            return memoizedSimulateTachyon(row+1, col);
        }
    }

    const memoizedSimulateTachyon = memoize(simulateTachyon);

    return memoizedSimulateTachyon(0, grid[0].indexOf("S"));
}

console.log(solve1());
console.log(solve2());
