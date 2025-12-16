const _ = require("underscore")

function part1() {
    const rocks = input.split("\n").map(a => a.split(""));

    let load = 0;

    for(let i = 0; i < rocks.length; ++i) {
        for(let j = 0; j < rocks[0].length; ++j) {
            // Move the rock up;
            if(rocks[i][j] == 'O') {
                let k = i;
                while(k > 0 && rocks[k-1][j] == ".") {
                    rocks[k][j] = ".";
                    rocks[k-1][j] = "O";
                    --k;
                }

                load += (rocks.length - k);
            }
        }
    }

    return load;
}

function part2() {
    let rocks = input.split("\n").map(a => a.split(""));

    function cycle(rocks, x, y) {
        let startX = 0, startY = 0;
        let endX = rocks[0].length, endY = rocks.length;
        let xDir = 1, yDir = 1;
        if(Math.max(x,y) == 1) {
            // Need to reverse!
            startX = rocks[0].length-1;
            startY = rocks.length-1;
            endX = -1;
            endY = -1;
            xDir = -1;
            yDir = -1;
        }
        for(let i = startY; i != endY; i+=yDir) {
            for(let j = startX; j != endX; j+=xDir) {
                // Move the rock;
                if(rocks[i][j] == 'O') {
                    let k = i, l = j;
                    while(k+y >= 0 && k+y < rocks.length && l+x >= 0 && l+x < rocks[0].length && rocks[k+y][l+x] == ".") {
                        rocks[k][l] = ".";
                        rocks[k+y][l+x] = "O";
                        k += y;
                        l += x;
                    }
                }
            }
        }

        return rocks;
    }

    let seen = {};
    let waitingFor = -1;

    for(let i = 0; i < 1000000000; ++i) {
        rocks = cycle(rocks, 0, -1);
        rocks = cycle(rocks, -1, 0);
        rocks = cycle(rocks, 0, 1);
        rocks = cycle(rocks, 1, 0);

        rocks = JSON.parse(JSON.stringify(rocks))

        if(waitingFor == i) {
            break;
        }

        if(waitingFor == -1) {
            let hash = '' + rocks;
            if(seen[hash]) {
                let head = seen[hash]
                let cycleTime = i - seen[hash];
                if((1000000000 - head) % cycleTime == 0) {
                    break;
                }
                waitingFor = i + (1000000000 - head) % cycleTime -1;
            } else {
                seen[hash] = i;
            }
        }
    }

    let load = 0;

    for(let i = 0; i < rocks.length; ++i) {
        for(let j = 0; j < rocks[0].length; ++j) {
            // Move the rock;
            if(rocks[i][j] == 'O') {
                load += (rocks.length - i);
            }
        }
    }

    return load;

}

var input = require("../input/2023/14.cjs");

console.log(part1());
console.log(part2());
