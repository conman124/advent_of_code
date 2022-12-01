const _ = require('underscore')

let coords = [];
function getCoordinateSymbol(x, y) {
    if(!coords[y]) {
        coords[y] = [];
    }

    if(!coords[y][x]) {
        coords[y][x] = Symbol(`${x}, ${y}`);
    }

    return coords[y][x];
}

function simulate(knotCount) {
    let visited = new Set();

    // Up is positive, right is positive
    let offsets = {
        "U": [0, 1],
        "R": [1, 0],
        "D": [0, -1],
        "L": [-1, 0]
    };

    let knots = [];
    for(let i = 0; i < knotCount; ++i) {
        knots[i] = [0, 0];
    }

    visited.add(getCoordinateSymbol(..._.last(knots)));

    function moveKnot(tailx, taily, headx, heady) {
        if([headx-1, headx, headx+1].indexOf(tailx) != -1 && [heady-1, heady, heady+1].indexOf(taily) != -1) {
            // Nothing to do here, it's only 1 away.
            return [tailx, taily];
        }

        if(taily > heady) {
            --taily;
        } else if(taily < heady) {
            ++taily;
        }

        if(tailx > headx) {
            --tailx;
        } else if(tailx < headx) {
            ++tailx;
        }
        
        return [tailx, taily];
    }

    let lines = input.split('\n');
    for(let i = 0; i < lines.length; ++i) {
        let [offsetx,offsety] = offsets[lines[i][0]];
        let count = parseInt(lines[i].split(' ')[1]);
        for(let j = 0; j < count; ++j) {
            knots[0][0] += offsetx;
            knots[0][1] += offsety;
            for(let k = 1; k < knots.length; ++k ) {
                knots[k] = moveKnot(...knots[k], ...knots[k-1]);
            }
            visited.add(getCoordinateSymbol(..._.last(knots)));
        }
    }

    return visited.size;
}

function part1() {
    return simulate(2);
}

function part2() {
    return simulate(10);
}

const input = require("../input/2022/09.js");

console.log(part1());
console.log(part2());
