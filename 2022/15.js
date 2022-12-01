function parseSensors() {
    return input.split('\n').map(line => {
        let match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);

        return [match[1], match[2], match[3], match[4]].map(Number);
    });
}

function L1(x1, y1, x2, y2) {
    return Math.abs(x1-x2) + Math.abs(y1-y2);
}

function part1() {
    const lineY = 2000000;

    let sensors = parseSensors();
    let noBeacons = new Set();

    sensors.forEach(([sensorX, sensorY, beaconX, beaconY]) => {
        let l1_beacon = L1(sensorX, sensorY, beaconX, beaconY);
        let l1_line = L1(sensorX, sensorY, sensorX, lineY);
        
        for(let i = sensorX - (l1_beacon - l1_line); i <= sensorX + (l1_beacon - l1_line); ++i) {
            noBeacons.add(i);
        }
    });

    // Remove any beacons that snuck in
    sensors.forEach(([_a, _b, beaconX, beaconY]) => {
        if(beaconY == lineY) {
            noBeacons.delete(beaconX);
        }
    });

    return noBeacons.size;
}

function getOutliningPoints([sensorX, sensorY, beaconX, beaconY]) {
    let ret = [];
    let distance = L1(sensorX, sensorY, beaconX, beaconY);

    // Top right
    for(let x = sensorX, y = sensorY - distance - 1; y < sensorY; ++x, ++y) {
        ret.push([x, y])
    }

    // Bottom right
    for(let x = sensorX + distance + 1, y = sensorY; x > sensorX; --x, ++y) {
        ret.push([x, y])
    }

    // Bottom left
    for(let x = sensorX, y = sensorY + distance + 1; y > sensorY; --x, --y) {
        ret.push([x, y])
    }

    // Top left
    for(let x = sensorX - distance - 1, y = sensorY; x < sensorX; ++x, --y) {
        ret.push([x, y])
    }

    return ret;
}

function overlapsSensor([pointX, pointY], [sensorX, sensorY, beaconX, beaconY]) {
    let pointDistance = L1(pointX, pointY, sensorX, sensorY);
    let beaconDistance = L1(beaconX, beaconY, sensorX, sensorY);
    
    return pointDistance <= beaconDistance;
}

function part2() {
    const maxDim = 4000000;
    let sensors = parseSensors();

    for(let i = 0; i < sensors.length; ++i) {
        let points = getOutliningPoints(sensors[i]);
        for(let j = 0; j < points.length; ++j) {
            if(points[j][0] < 0 || points[j][0] > maxDim || points[j][1] < 0 || points[j][1] > maxDim) {
                continue;
            }

            let foundOverlap = false;
            for(let k = 0; k < sensors.length; ++k) {
                if(k == i) { continue; }

                if(overlapsSensor(points[j], sensors[k])) {
                    foundOverlap = true;
                    break;
                }
            }

            if(!foundOverlap) {
                return points[j][0] * maxDim + points[j][1];
            }
        }
    }

    throw new LogicError("couldn't find point without overlap");
}

const input = require("../input/2022/15.js")

console.log(part1());
console.log(part2());
