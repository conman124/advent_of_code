function calculate(steps) {
    // Shoelace theorem

    let directions = {L: [-1, 0], U: [0,1], R: [1, 0], D: [0, -1]};

    let area = 0;
    let border = 0;

    let curX = 0, curY = 0;
    for(let i = 0; i < steps.length; ++i) {
        let lastX = curX;
        let lastY = curY;

        curX += directions[steps[i][0]][0] * steps[i][1];
        curY += directions[steps[i][0]][1] * steps[i][1];

        area += lastX * curY - curX * lastY;

        border += steps[i][1]
    }

    return Math.abs(area / 2) + border / 2 + 1; // no idea why I need the +1, I think I'm probably not properly counting the starting point or something
}

function part1() {
    let steps = input.split("\n").map(a => {let s = a.split(" "); return [s[0], parseInt(s[1])]});

    return calculate(steps);
}

function part2() {
    let steps = input.split("\n").map(a => {
        let result = /\(#(.....)(.)\)/.exec(a);

        let map = {
            "0": "R",
            "1": "D",
            "2": "L",
            "3": "U"
        }

        return [ map[result[2]], parseInt(result[1], 16) ];
    })

    return calculate(steps);
}

const input = require("../input/2023/18.js")

console.log(part1());
console.log(part2());