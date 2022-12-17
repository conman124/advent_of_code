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

const input2 = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const input = `Sensor at x=3842919, y=126080: closest beacon is at x=3943893, y=1918172
Sensor at x=406527, y=2094318: closest beacon is at x=-1066, y=1333278
Sensor at x=2208821, y=3683408: closest beacon is at x=2914373, y=3062268
Sensor at x=39441, y=1251806: closest beacon is at x=-1066, y=1333278
Sensor at x=3093352, y=2404566: closest beacon is at x=2810772, y=2699609
Sensor at x=3645473, y=2234498: closest beacon is at x=3943893, y=1918172
Sensor at x=3645012, y=2995540: closest beacon is at x=4001806, y=2787325
Sensor at x=18039, y=3083937: closest beacon is at x=103421, y=3007511
Sensor at x=2375680, y=551123: closest beacon is at x=2761373, y=2000000
Sensor at x=776553, y=123250: closest beacon is at x=-1066, y=1333278
Sensor at x=2884996, y=2022644: closest beacon is at x=2761373, y=2000000
Sensor at x=1886537, y=2659379: closest beacon is at x=2810772, y=2699609
Sensor at x=3980015, y=3987237: closest beacon is at x=3844688, y=3570059
Sensor at x=3426483, y=3353349: closest beacon is at x=3844688, y=3570059
Sensor at x=999596, y=1165648: closest beacon is at x=-1066, y=1333278
Sensor at x=2518209, y=2287271: closest beacon is at x=2761373, y=2000000
Sensor at x=3982110, y=3262128: closest beacon is at x=3844688, y=3570059
Sensor at x=3412896, y=3999288: closest beacon is at x=3844688, y=3570059
Sensor at x=2716180, y=2798731: closest beacon is at x=2810772, y=2699609
Sensor at x=3575486, y=1273265: closest beacon is at x=3943893, y=1918172
Sensor at x=7606, y=2926795: closest beacon is at x=103421, y=3007511
Sensor at x=2719370, y=2062251: closest beacon is at x=2761373, y=2000000
Sensor at x=1603268, y=1771299: closest beacon is at x=2761373, y=2000000
Sensor at x=3999678, y=1864727: closest beacon is at x=3943893, y=1918172
Sensor at x=3157947, y=2833781: closest beacon is at x=2914373, y=3062268
Sensor at x=3904662, y=2601010: closest beacon is at x=4001806, y=2787325
Sensor at x=3846359, y=1608423: closest beacon is at x=3943893, y=1918172
Sensor at x=2831842, y=3562642: closest beacon is at x=2914373, y=3062268
Sensor at x=3157592, y=1874755: closest beacon is at x=2761373, y=2000000
Sensor at x=934300, y=2824967: closest beacon is at x=103421, y=3007511
Sensor at x=3986911, y=1907590: closest beacon is at x=3943893, y=1918172
Sensor at x=200888, y=3579976: closest beacon is at x=103421, y=3007511
Sensor at x=967209, y=3837958: closest beacon is at x=103421, y=3007511
Sensor at x=3998480, y=1972726: closest beacon is at x=3943893, y=1918172`

console.log(part1());
console.log(part2());
