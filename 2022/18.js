function part1() {
    let locations = input.split('\n').reduce((obj,line)=> {obj[line] = 1; return obj;}, {});
    let surfaceArea = 0;

    function getSurfaceAreaContribution(pos) {
        if(locations[pos.join(',')]) {
            return 0;
        }
        return 1;
    }

    for(let pos in locations) {
        let [x, y, z] = pos.split(',').map(Number);
        surfaceArea += getSurfaceAreaContribution([x+1, y, z]);
        surfaceArea += getSurfaceAreaContribution([x-1, y, z]);
        surfaceArea += getSurfaceAreaContribution([x, y+1, z]);
        surfaceArea += getSurfaceAreaContribution([x, y-1, z]);
        surfaceArea += getSurfaceAreaContribution([x, y, z+1]);
        surfaceArea += getSurfaceAreaContribution([x, y, z-1]);
    }

    return surfaceArea;
}

function part2() {
    let max = 0;
    input.split('\n')
        .forEach(line => {

            max = Math.max.call(null, max, ...line.split(',').map(Number));
        });

    let arr = [];
    for(let x = 0; x < max+3; ++x) {
        arr.push([]);
        for(let y = 0; y < max+3; ++y) {
            let z = new Array(max+3);
            z.fill(0);
            arr[x].push(z);
        }
    }

    let locations = {};
    input.split('\n')
        .forEach(line => {
            let [x,y,z] = line.split(',').map(Number);
            arr[x+1][y+1][z+1] = 1;
            locations[line] = 1;
        });

    function fill(x, y, z) {
        if(x < 0 || x >= arr.length || y < 0 || y >= arr[0].length || z < 0 || z >= arr[0][0].length) {
            return;
        }

        if(arr[x][y][z] == 0) {
            arr[x][y][z] = 2;
            fill(x+1, y, z);
            fill(x-1, y, z);
            fill(x, y+1, z);
            fill(x, y-1, z);
            fill(x, y, z+1);
            fill(x, y, z-1);
        }
    }

    fill(0, 0, 0);

    let surfaceArea = 0;

    function getSurfaceAreaContribution([x,y,z]) {
        if(arr[x][y][z] == 2) {
            return 1;
        }
        return 0;
    }

    for(let pos in locations) {
        let [x, y, z] = pos.split(',').map(Number);
        ++x;
        ++y;
        ++z;
        surfaceArea += getSurfaceAreaContribution([x+1, y, z]);
        surfaceArea += getSurfaceAreaContribution([x-1, y, z]);
        surfaceArea += getSurfaceAreaContribution([x, y+1, z]);
        surfaceArea += getSurfaceAreaContribution([x, y-1, z]);
        surfaceArea += getSurfaceAreaContribution([x, y, z+1]);
        surfaceArea += getSurfaceAreaContribution([x, y, z-1]);
    }

    return surfaceArea;
}

const input = require("../input/2022/18.js");

console.log(part1());
console.log(part2());
