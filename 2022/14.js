const _ = require('underscore');

const width = 800;
const height = 200;
const sourcex = 500;
const sourcey = 0;

function parseMap() {
    let maxy = -1;
    let map = [];
    for(let i = 0; i < height; ++i) {
        map.push(new Array(width).fill('.'));
    }

    function markRock([[startx, starty], [endx, endy]]) {
        maxy = Math.max.apply(undefined, [starty, endy, maxy]);

        if(startx != endx && starty != endy) {
            throw new Error("logic error, diagonal lines");
        }
        let offx = 0;
        let offy = 0;

        if(startx == endx) {
            offy = (endy > starty) ? 1 : -1;
        } else {
            offx = (endx > startx) ? 1 : -1;
        }

        for(let x = startx, y = starty; !(x == endx && y == endy); x += offx, y += offy) {
            map[y][x] = '#';
        }
        map[endy][endx] = '#';
    }

    input.split('\n').forEach(rock => {
        // Iterators would make this so much better
        let points = rock.split(' -> ').map(point => point.split(',').map(Number));
        let points2 = _.clone(points);
        points.pop();
        points2.shift();
        let lineSegments = _.zip(points, points2);
        lineSegments.forEach(markRock);
    });

    return {map, maxy};
}

function simulate(map, fellOff, halted ) {
    // returns fellOff(x, y) if the sand falls off the screen, halted(x,y) otherwise.  Also updates map with the
    // new sand location
    function dropSand(x, y) {
        if(x >= map[0].length || y+1 >= map.length) {
            return fellOff(x, y);
        }

        if(map[y+1][x] == '.') {
            return dropSand(x, y+1);
        }
        if(x-1 < 0 || map[y+1][x-1] == '.') {
            return dropSand(x-1, y+1);
        }
        if(x+1 >= map[0].length || map[y+1][x+1] == '.') {
            return dropSand(x+1, y+1);
        }

        map[y][x] = 'o';
        return halted(x, y);
    }

    let count = 0;
    while(!dropSand(sourcex, sourcey)) {
        ++count;
    }

    return count;
}

function part1() {
    let {map} = parseMap();

    return simulate(map, () => true, () => false);
}

function part2() {
    let {map, maxy} = parseMap();

    for(let i = 0; i < map[0].length; ++i) {
        map[maxy+2][i] = '#';
    }

    return simulate(map, () => {throw new Error("logic error, fell off in part 2");}, (x,y) => (x == sourcex && y == sourcey))+1;
}

const input = require("../input/2022/14.js");

console.log(part1());
console.log(part2());
