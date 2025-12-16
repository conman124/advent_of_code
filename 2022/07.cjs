const sum = require('../sum.cjs')

function readFs() {
    const lines = input.split('\n');

    let curDir = {
        name: "",
        parent: null,
        size: 0,
        childFiles: [],
        childDirs: []
    };
    let rootDir = curDir;

    for(let i = 0; i < lines.length; ++i) {
        if(lines[i][0] != '$') {
            throw new Error("parsing error " + lines[i]);
        }

        let command = lines[i].split(' ');
        if(command[1] == "cd") {
            if(command[2] == "/") {
                curDir = rootDir;
            } else if(command[2] == "..") {
                curDir = curDir.parent;
            } else {
                curDir = curDir.childDirs.find(dir => dir.name == command[2]);
            }
            if(!curDir) { throw new Error("Tried to cd to directory that doesn't exist") }
        } else if(command[1] == "ls") {
            while(lines[i+1] && lines[i+1][0] != '$') {
                ++i;
                let contents = lines[i].split(' ');
                if(contents[0] == "dir") {
                    let newDir = {
                        name: contents[1],
                        parent: curDir,
                        size: 0,
                        childFiles: [],
                        childDirs: []
                    };
                    curDir.childDirs.push(newDir);
                } else {
                    let size = parseInt(contents[0]);
                    curDir.childFiles.push(size);
                }
            }
        } else {
            throw new Error("unrecognized command");
        }
    }

    (function calcSizes(dir) {
        dir.size = dir.childFiles.reduce(sum, 0);
        for(let i = 0; i < dir.childDirs.length; ++i) {
            calcSizes(dir.childDirs[i]);
            dir.size += dir.childDirs[i].size;
        }
    })(rootDir);

    return rootDir;
}

function part1() {
    let rootDir = readFs();

    let totalSize = 0;
    (function addSizes(dir) {
        if(dir.size <= 100000) {
            totalSize += dir.size;
        }
        dir.childDirs.forEach(addSizes)
    })(rootDir);

    return totalSize;
}

function part2() {
    let rootDir = readFs();

    let requiredSpace = 30000000 - (70000000 - rootDir.size);
    let possibleDirs = [];

    (function findDirs(dir) {
        if(dir.size >= requiredSpace) {
            possibleDirs.push(dir.size);
        }
        dir.childDirs.forEach(findDirs);
    })(rootDir);

    return Math.min(...possibleDirs);
}

const input = require("../input/2022/07.cjs");

console.log(part1());
console.log(part2());
