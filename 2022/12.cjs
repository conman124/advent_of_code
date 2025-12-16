function getMap() {
    let startx;
    let starty;
    let endx;
    let endy;

    let map = input.split('\n').map((line, y) => {
        return line.split('').map((char, x) => {
            if(char == 'S') {
                char = 'a';
                startx = x;
                starty = y;
            } else if (char == 'E') {
                char = 'z';
                endx = x;
                endy = y;
            }

            return char.charCodeAt(0) - 'a'.charCodeAt(0);
        });
    });

    return {
        startx,
        starty,
        endx,
        endy,
        map
    }
}

function common(map, startx, starty, isDone, canTraverse) {
    function coordsToString(x, y) {
        return `{${x},${y}}`
    }

    let depth = 0;
    let visited = new Set().add(coordsToString(startx, starty));
    let toVisit = [[startx, starty]];
    let nextVisit = [];

    function canVisit(curx, cury, nextx, nexty) {
        if(nextx < 0 || nextx >= map[0].length || nexty < 0 || nexty >= map.length) {
            return false;
        }

        if(!canTraverse(curx, cury, nextx, nexty)) {
            return false;
        }

        if(visited.has(coordsToString(nextx, nexty))) {
            return false;
        }

        return true;
    }

    while(true) {
        while(toVisit.length) {
            let [nextx, nexty] = toVisit.shift();

            if(isDone(nextx, nexty)) {
                return depth;
            }

            if(canVisit(nextx, nexty, nextx, nexty-1)) {
                visited.add(coordsToString(nextx, nexty-1));
                nextVisit.push([nextx, nexty-1]);
            }
            if(canVisit(nextx, nexty, nextx, nexty+1)) {
                visited.add(coordsToString(nextx, nexty+1));
                nextVisit.push([nextx, nexty+1]);
            }
            if(canVisit(nextx, nexty, nextx-1, nexty)) {
                visited.add(coordsToString(nextx-1, nexty));
                nextVisit.push([nextx-1, nexty]);
            }
            if(canVisit(nextx, nexty, nextx+1, nexty)) {
                visited.add(coordsToString(nextx+1, nexty));
                nextVisit.push([nextx+1, nexty]);
            }
        }
        ++depth;
        toVisit = nextVisit;
        nextVisit = [];
    }
}

function part1() {
    let {
        startx,
        starty,
        endx,
        endy,
        map
    } = getMap();

    return common(map, startx, starty, 
        (x, y) => (x == endx && y == endy),
        (curx, cury, nextx, nexty) => (map[nexty][nextx] <= map[cury][curx] + 1)
    );
}

function part2() {
    let {
        endx,
        endy,
        map
    } = getMap();

    return common(map, endx, endy,
        (x, y) => map[y][x] == 0,
        (curx, cury, nextx, nexty) => (map[nexty][nextx] >= map[cury][curx] - 1)
    );
}

const input = require("../input/2022/12.cjs");

console.log(part1());
console.log(part2());
