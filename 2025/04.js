import input from "../input/2025/04.js";
import unboundedGrid from "../unbounded_grid.js";


function solve1() {
    const grid = input.split("\n").map(a => a.split(""));
    let available = 0;
    for(let row = 0; row < grid.length; ++row) {
        for(let col = 0; col < grid[0].length; ++col) {
            if(grid[row][col] == ".") continue;
            let neighbors = 0;
            for(let i = -1; i <= 1; ++i) {
                for(let j = -1; j <= 1; ++j) {
                    if(i == 0 && j == 0) continue;

                    if(unboundedGrid(grid, row+i, col+j, ".") == "@") {
                        ++neighbors;
                    }
                }
            }
            if(neighbors <= 3) {
                ++available;
            }
        }
    }
    return available;
}

function solve2() {
    const grid = input.split("\n").map(a => a.split(""));
    let changed = true;
    let available = 0;
    while(changed) {
        changed = false;
        for(let row = 0; row < grid.length; ++row) {
            for(let col = 0; col < grid[0].length; ++col) {
                if(grid[row][col] == ".") continue;
                let neighbors = 0;
                for(let i = -1; i <= 1; ++i) {
                    for(let j = -1; j <= 1; ++j) {
                        if(i == 0 && j == 0) continue;

                        if(unboundedGrid(grid, row+i, col+j, ".") == "@") {
                            ++neighbors;
                        }
                    }
                }
                if(neighbors <= 3) {
                    ++available;
                    changed=true;
                    grid[row][col] = ".";
                }
            }
        }
    }
    return available;

}

console.log(solve1());
console.log(solve2());
