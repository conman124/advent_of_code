function canonicalize(x, y, xDir, yDir) {
    return `${x}_${y}_${xDir}_${yDir}`;
}

function recurse(map, seen, energized, x, y, xDir, yDir) {
    if(x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return;
    }

    if(seen.has(canonicalize(x, y, xDir, yDir))) {
        return;
    }

    seen.add(canonicalize(x, y, xDir, yDir));
    energized.add(canonicalize(x, y, "", ""));

    if(map[y][x] == ".") {
        recurse(map, seen, energized, x+xDir, y+yDir, xDir, yDir);
    } else if(map[y][x] == "-") {
        if(xDir != 0) {
            recurse(map, seen, energized, x+xDir, y+yDir, xDir, yDir);
        } else {
            recurse(map, seen, energized, x-1, y, -1, 0);
            recurse(map, seen, energized, x+1, y, +1, 0);
        }
    } else if(map[y][x] == "|") {
        if(yDir != 0) {
            recurse(map, seen, energized, x+xDir, y+yDir, xDir, yDir);
        } else {
            recurse(map, seen, energized, x, y-1, 0, -1);
            recurse(map, seen, energized, x, y+1, 0, +1);
        }
    } else {
        let reflector = map[y][x] == "/" ? -1 : 1;

        let tmp = yDir;
        yDir = xDir * reflector;
        xDir = tmp * reflector;

        recurse(map, seen, energized, x+xDir, y+yDir, xDir + 0, yDir + 0);
    }
}

function part1() {
    let seen = new Set();
    let energized = new Set();

    let map = input.split("\n").map(a => a.split(""));

    recurse(map, seen, energized, 0, 0, 1, 0);

    return energized.size;
}

function part2() {
    let max = 0;

    let map = input.split("\n").map(a => a.split(""));

    // assumes square input
    for(let i = 0; i < map.length; ++i) {
        function calculate(x, y, xDir, yDir) {
            let seen = new Set();
            let energized = new Set();

            recurse(map, seen, energized, x, y, xDir, yDir);
            
            max = Math.max(max, energized.size);
        }

        calculate(i, 0, 0, 1);
        calculate(0, i, 1, 0);
        calculate(i, map.length-1, 0, -1);
        calculate(map.length-1, i, -1, 0);
    }

    return max;

}

var input = require("../input/2023/16.js");

console.log(part1());
console.log(part2());