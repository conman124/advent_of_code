const _ = require("underscore");
const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

function parsedInput() {
    return input.split('\n')
        .map(a => {
            const [game, cubesStr] = a.split(': ');
            const id = parseInt(game.split(" ")[1]);
            const cubes = cubesStr.split("; ")
                .map(a => {
                    const cubes = {r: 0, g: 0, b: 0};
                    let match;
                    const regex = new RegExp(/(\d+) (red|green|blue)/g);
                    while(match = regex.exec(a)) {
                        cubes[match[2][0]] = parseInt(match[1]);
                    }

                    return cubes;
                });

            return {
                id,
                cubes
            }
        });
}

function part1() {
    return parsedInput()
        .filter(isPlayable)
        .map(a => a.id)
        .reduce(sum);

    function isPlayable(game) {
        return _.every(game.cubes, function(cubes) {
            return cubes.r <= 12 && cubes.g <= 13 && cubes.b <= 14;
        });
    }
}

function part2() {
    return parsedInput()
        .map(a => {
            return a.cubes.reduce((acc, current) => {
                return [Math.max(acc[0], current.r), Math.max(acc[1], current.g), Math.max(acc[2], current.b)]
            }, [0, 0, 0]);
        })
        .map(([a,b,c]) => a*b*c)
        .reduce(sum);
}

const input = require("../input/2023/02.cjs");

console.log(part1());
console.log(part2());
