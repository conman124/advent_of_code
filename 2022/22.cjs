const OPEN=0;
const WALL=1;
const WRAP=2;

function changeDir([offx, offy], instruction) {
    // Probably overly complex, I just didn't want to write out all the logic
    let cos;
    let sin;
    if(instruction == 'L') {
        cos = 0;
        sin = -1;
    } else {
        cos = 0;
        sin = 1;
    }

    return [offx * cos - offy * sin, offx * sin + offy * cos];
}

function parse() {
    const [mapStr, instructionsStr] = input.split('\n\n');
    const map = mapStr.split('\n').map(line => {
        return line.split('').map(a => {
            if(a=='.') {
                return OPEN;
            } else if(a=='#') {
                return WALL;
            } else {
                return WRAP;
            }
        })
    });

    const instructions = instructionsStr.split(/(\d+|L|R)/g).filter(a=>a);

    return [map, instructions];
}

function run(map, instructions, getWrappedPos) {
    let pos = [map[0].indexOf(OPEN), 0];
    let dir = [1, 0];

    function getHeadingNum([offx, offy]) {
        if(offx == 0) {
            if(offy == 1) {
                return 1;
            }
            return 3;
        } else {
            if(offx == 1) {
                return 0;
            }
            return 2;
        }
    }

    instructions.forEach(instruction => {
        if(instruction == 'L' || instruction == 'R') {
            dir = changeDir(dir, instruction);
        } else {
            let count = parseInt(instruction);
            for(let i = 0; i < count; ++i) {
                let [[wrappedx, wrappedy], [offx, offy]] = getWrappedPos(pos, dir);
                if(map[wrappedy + offy][wrappedx + offx] == WALL) {
                    break;
                } else {
                    pos = [wrappedx + offx, wrappedy + offy];
                    dir = [offx, offy];
                }
            }
        }
    });

    let col = pos[0] + 1;
    let row = pos[1] + 1;
    let heading = getHeadingNum(dir);

    return 1000 * row + 4 * col + heading;
}

function part1() {
    let [map, instructions] = parse();

    function getWrappedPos([posx, posy], [offx, offy]) {
        let nextx = posx + offx, nexty = posy + offy;
        if(nexty < 0 || nexty >= map.length || nextx < 0 || nextx >= map[nexty].length || map[nexty][nextx] == WRAP) {
            do {
                nextx -= offx;
                nexty -= offy;
            } while (nexty >= 0 && nexty < map.length && nextx >= 0 && nextx < map[nexty].length && map[nexty][nextx] != WRAP);
            posx = nextx;
            posy = nexty;
        }
        return [[posx, posy], [offx, offy]];
    }

    return run(map, instructions, getWrappedPos);
}

function part2() {
    let [map, instructions] = parse();
    let cube;
    let length;

    // TODO this is slightly cheating, I just can't think of how to generalize this...
    if(map[0].length == 12) {
        // demo input
        length = 4;
        cube = [
            null,
            null,
            {left: {dir: "top", pos: 5}, top: {dir: "top", pos: 4}, right: {dir: "right", pos: 11}},
            null,
            {left: {dir: "bottom", pos: 11}, top: {dir: "top", pos: 3}, bottom: {dir: "bottom", pos: 10}},
            {top: {dir: "left", pos: 2}, bottom: {dir: "left", pos: 10}},
            {right: {dir: "top", pos: 11}},
            null,
            null,
            null,
            {left: {dir: "bottom", pos: 5}, bottom: {dir: "bottom", pos: 4}},
            {top: {dir: "right", pos: 6}, right: {dir: "right", pos: 2}, bottom: {dir: "left", pos: 4}},
            null,
            null,
            null,
            null
        ];
    } else if (map[0].length == 150) {
        // real input
        length = 50;
        cube = [
            null,
            {left: {dir: "left", pos: 8}, top: {dir: "left", pos: 12 }},
            {top: {dir: "bottom", pos: 12}, right: {dir: "right", pos: 9}, bottom: {dir: "right", pos: 5}},
            null,
            null,
            {left: {dir: "top", pos: 8}, right: {dir: "bottom", pos: 2}},
            null,
            null,
            {left: {dir: "left", pos: 1}, top: {dir: "left", pos: 5}},
            {right: {dir: "right", pos: 2}, bottom: {dir: "right", pos: 12}},
            null,
            null,
            {left: {dir: "top", pos: 1}, right: {dir: "bottom", pos: 9}, bottom: {dir: "top", pos: 2}},
            null,
            null,
            null
        ];
    } else {
        throw new Error("bad input");
    }

    function getWrappedPos([posx, posy], [offx, offy]) {
        // this is probably overly complicated but I can't think how best to generalize... :(

        let curPos = Math.floor(posy / length) * 4 + Math.floor(posx / length);
        let nextPos = Math.floor((posy+offy) / length) * 4 + Math.floor((posx + offx) / length);
        let srcDir;
        if(offx == 0) {
            if(offy == -1) {
                srcDir = "top";
            } else {
                srcDir = "bottom";
            }
        } else {
            if(offx == -1) {
                srcDir = "left";
            } else {
                srcDir = "right";
            }
        }

        if(!["top", "right", "bottom", "left"].includes(srcDir)) {
            throw new Error("bug getting srcDir");
        }

        if(curPos == nextPos || !cube[curPos][srcDir]) {
            return [[posx, posy], [offx, offy]];
        }

        let cubex = posx % length;
        let cubey = posy % length;
        let nextCubeCoordX = (cube[curPos][srcDir].pos % 4) * length;
        let nextCubeCoordY = Math.floor(cube[curPos][srcDir].pos / 4) * length;
        let destDir = cube[curPos][srcDir].dir;

        if(!["top", "right", "bottom", "left"].includes(destDir)) {
            throw new Error("bug getting destDir");
        }

        if(srcDir == destDir) {
            let retoffx = offx * -1, retoffy = offy * -1;
            let retx, rety;
            if(srcDir == "top" || srcDir == "bottom") {
                retx = nextCubeCoordX + length - cubex - 1;
                rety = nextCubeCoordY + cubey - retoffy;
            } else {
                retx = nextCubeCoordX + cubex - retoffx;
                rety = nextCubeCoordY + length - cubey - 1;
            }
            return [[retx, rety], [retoffx, retoffy]];
        }

        let instruction;
        let retx, rety;
        if(srcDir == "left") {
            if(destDir == "right") {
                retx = length;
                rety = cubey;
            } else if(destDir == "top") {
                instruction = "L";
                retx = cubey;
                rety = -1;
            } else if(destDir == "bottom") {
                instruction = "R";
                retx = length - cubey - 1;
                rety = length;
            } else {
                throw new Error("unexpected direction");
            }
        } else if(srcDir == "top") {
            if(destDir == "bottom") {
                retx = cubex;
                rety = length;
            } else if(destDir == "left") {
                instruction = "R";
                retx = -1;
                rety = cubex;
            } else if(destDir == "right") {
                instruction = "L";
                retx = length;
                rety = length - cubex - 1;
            } else {
                throw new Error("unexpected direction");
            }
        } else if(srcDir == "right") {
            if(destDir == "left") {
                retx = -1;
                rety = cubey;
            } else if(destDir == "top") {
                instruction = "R";
                retx = length - cubey - 1;
                rety = -1;
            } else if(destDir == "bottom") {
                instruction = "L";
                retx = cubey;
                rety = length;
            } else {
                throw new Error("unexpected direction");
            }
        } else if(srcDir == "bottom") {
            if(destDir == "top") {
                retx = cubex;
                rety = -1;
            } else if(destDir == "left") {
                instruction = "L";
                retx = -1;
                rety = length - cubex - 1;
            } else if(destDir == "right") {
                instruction = "R";
                retx = length;
                rety = cubex;
            } else {
                throw new Error("unexpected direction");
            }
        } else {
            throw new Error("bad direction");
        }

        let newDir = [offx, offy];
        if(instruction) {
            newDir = changeDir(newDir, instruction);
        }

        return [[nextCubeCoordX + retx, nextCubeCoordY + rety], newDir];
    }

    return run(map, instructions, getWrappedPos);
}

const input = require("../input/2022/22.cjs");

console.log(part1());
console.log(part2());
