const sum = require("../sum.cjs");

function hash(str) {
    return Array.prototype.reduce.call(str, (current, ch) => {
        current += ch.charCodeAt(str);
        current *= 17;
        return current % 256;
    }, 0);
}

function part1() {
    return input.split(",")
        .map(hash)
        .reduce(sum);
}

function part2() {
    let instructions = input.split(",");
    let map = new Array(256).fill(0).map(a => []);

    for(let i = 0; i < instructions.length; ++i) {
        if(instructions[i].endsWith("-")) {
            let label = instructions[i].slice(0, -1);
            let hashCode = hash(label);

            map[hashCode] = map[hashCode].filter(lens => lens.label != label);
        } else {
            let [label, focalLength] = instructions[i].split("=");
            let hashCode = hash(label);

            let found = false;
            for(let i = 0; i < map[hashCode].length; ++i) {
                if(map[hashCode][i].label == label) {
                    found = true;
                    map[hashCode][i].focalLength = focalLength;
                    break;
                }
            }
            if(!found) {
                map[hashCode].push({label, focalLength});
            }
        }
    }

    return map.map((box, boxIndex) => {
        return box.map((lens, lensIndex) => {
            return (1+boxIndex) * (1+lensIndex) * lens.focalLength;
        }).reduce(sum, 0);
    }).reduce(sum, 0);

}

const input = require("../input/2023/15.cjs");

console.log(part1());
console.log(part2());
