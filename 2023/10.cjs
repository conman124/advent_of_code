function canonicalize(x1, y1, x2, y2) {
    if(x1 < x2) {
        return `${x1}x${y1}_${x2}x${y2}`;
    } else if(x2 < x1) {
        return `${x2}x${y2}_${x1}x${y1}`;
    } else if(y1 < y2) {
        return `${x1}x${y1}_${x2}x${y2}`;
    } else {
        return `${x2}x${y2}_${x1}x${y1}`;
    }
}

function part1() {
    const map = input.split("\n").map(a => a.split(""));

    let sx, sy;
findS:
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[0].length; ++j) {
            if(map[i][j] === 'S') {
                sx = j;
                sy = i;
                break findS;
            }
        }
    }

    function next(x, y, prevx, prevy) {
        let possibleX = [];
        let possibleY = [];

        switch(map[y][x]) {
            case '-':
                possibleX = [x-1, x+1];
                possibleY = [y, y];
                break;
            case '|':
                possibleX = [x, x];
                possibleY = [y-1, y+1];
                break;
            case 'L':
                possibleX = [x, x+1];
                possibleY = [y-1, y];
                break;
            case 'J':
                possibleX = [x, x-1];
                possibleY = [y-1, y];
                break;
            case '7':
                possibleX = [x, x-1];
                possibleY = [y+1, y];
                break;
            case 'F':
                possibleX = [x, x+1];
                possibleY = [y+1, y];
                break;
            default:
                throw new Error("unexpected tile: " + x + " " + y + " " + map[y][x]);
        }

        if(prevx == possibleX[0] && prevy == possibleY[0]) {
            return [possibleX[1], possibleY[1]];
        } else {
            return [possibleX[0], possibleY[0]];
        }
    }

    let prevx = sx, prevy = sy;
    let x, y;
    // find my next position
    if(map[sy][sx-1] == "-" || map[sy][sx-1] == "F" || map[sy][sx-1] == "L") {
        x = sx-1;
        y = sy;
    } else if(map[sy-1][sx] == "7" || map[sy-1][sx] == "|" || map[sy-1][sx] == "F") {
        x = sx;
        y = sy-1;
    } else if(map[sy][sx+1] == "J" || map[sy][sx+1] == "-" || map[sy][sx+1] == "7") {
        x = sx+1;
        y = sy;
    } else {
        throw new Error("Starting position not found");
    }

    let i = 0;

    const segments = new Set();

    while(map[y][x] != 'S') {
        segments.add(canonicalize(x, y, prevx, prevy));

        let [tempx, tempy] = next(x, y, prevx, prevy);
        prevx = x;
        prevy = y;
        x = tempx;
        y = tempy;
        i++;
    }

    segments.add(canonicalize(x, y, prevx, prevy));

    return [(i+1) / 2, map, segments];
}

function part2(map, segments) {
    let staggeredMap = new Array(map.length+1).fill(0).map(_ => new Array(map[0].length+1).fill(false));

    // Count how many crossings between each half point and the edge of the map
    // If it is odd, this half point is "in" the loop.  If a full point has
    // all four neighbors being in the loop, it is in the loop.
    for(let i = 0; i < staggeredMap.length; ++i) {
        for(let j = 0; j < staggeredMap[0].length; ++j) {
            let crossings = 0;
            for(let k = i; k >= 1; --k) {
                if(segments.has(canonicalize(j-1, k-1, j, k-1))) {
                    ++crossings;
                }
            }
            if(crossings % 2 == 1) {
                staggeredMap[i][j] = true;
            }
        }
    }

    let inside = 0;
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[0].length; ++j) {
            if(staggeredMap[i][j] && staggeredMap[i+1][j] && staggeredMap[i][j+1] && staggeredMap[i+1][j+1]) {
                ++inside;
            }
        }
    }

    return inside;
}

var input = require("../input/2023/10.cjs");

const [part1res, map, segments] = part1();
console.log(part1res);
console.log(part2(map, segments));
