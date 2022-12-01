const tee = require("../tee");
const _ = require("underscore");

function performMap(map, source) {
    for(let i = 0; i < map.length; ++i) {
        if(source >= map[i][1] && source < map[i][1] + map[i][2]) {
            return map[i][0] + (source - map[i][1]);
        }
    }
    return source;
}

function createMapper(text) {
    const map = text.split("\n")
        .slice(1)
        .map(a => a.split(" ").map(Number))

    return function(source) {
        return performMap(map, source);
    }
}

function part1() {
    const split = input.split('\n\n');
    const seeds = split[0].split(": ")[1].split(' ').map(Number);

    const seed2soil = createMapper(split[1]);
    const soil2fertilizer = createMapper(split[2]);
    const fertilizer2water = createMapper(split[3]);
    const water2light = createMapper(split[4]);
    const light2temperature = createMapper(split[5]);
    const temperature2humidity = createMapper(split[6]);
    const humidity2location = createMapper(split[7]);

    let min = Number.POSITIVE_INFINITY;
    for(let seed of seeds) {
        // I wrote it as a map originally but I'm too lazy to switch the order now
        let loc = [seed].map(seed2soil).map(soil2fertilizer).map(fertilizer2water).map(water2light).map(light2temperature).map(temperature2humidity).map(humidity2location)[0];
        min = Math.min(loc, min);
    }

    return min;
}

function part2() {
    const split = input.split('\n\n');
    const seedRanges = _.chunk(split[0].split(": ")[1].split(' ').map(Number), 2);

    class Interval {
        constructor(begin, end) {
            this.begin = begin;
            this.end = end;
        }
    }

    class Mapping {
        constructor(src, dest) {
            this.src = src;
            this.dest = dest;
        }

        remap(other) {
            // split my dest into segments of overlap with mappings from other
            let segments = [];
            let pos = this.dest.begin;

            let possiblePoints = [this.dest.end];
            for(let i = 0; i < other.mappings.length; ++i) {
                possiblePoints.push(other.mappings[i].src.begin);
                possiblePoints.push(other.mappings[i].src.end);
            }

            while(pos != this.dest.end+1) {
                // find the next relevant section
                let nextPoint = Math.min(...(possiblePoints.filter(x => x > pos)));
                segments.push(new Interval(pos, nextPoint));
                pos = nextPoint+1;
            }

            // return the new mappings
            return segments.map(segment => {
                // map my dest back onto my source
                let src = new Interval(segment.begin - this.dest.begin + this.src.begin, segment.end - this.dest.end + this.src.end);
                let intermediate = segment;
                // map the intermediate to the other dest
                let dest = intermediate; // If no mapping matches, it will just be the intermediate mapping
                for(let i = 0; i < other.mappings.length; ++i) {
                    if(other.mappings[i].src.begin <= intermediate.begin && other.mappings[i].src.end >= intermediate.end) {
                        dest = new Interval(intermediate.begin - other.mappings[i].src.begin + other.mappings[i].dest.begin, intermediate.end - other.mappings[i].src.end + other.mappings[i].dest.end);
                        break;
                    }
                }

                return new Mapping(src, dest);
            });
        }
    }

    class MappingSet {
        constructor(mappings) {
            this.mappings = mappings;
        }

        remap(other) {
            return new MappingSet(_.chain(this.mappings)
                .map(mapping => {
                    return mapping.remap(other);
                }).flatten().value()
            );
        }
    }

    function createMappingSet(txt) {
        return new MappingSet(
            txt.split('\n')
                .slice(1)
                .map(mapStr => {
                    let [dstStart, srcStart, count] = mapStr.split(" ").map(Number);
                    return new Mapping(new Interval(srcStart, srcStart + count - 1), new Interval(dstStart, dstStart + count - 1));
                })
        );
    }

    const seedMap = new MappingSet(seedRanges.map(([start,length]) => new Mapping(new Interval(start, start+length-1), new Interval(start, start+length-1))));
    const seed2soil = createMappingSet(split[1]);
    const soil2fertilizer = createMappingSet(split[2]);
    const fertilizer2water = createMappingSet(split[3]);
    const water2light = createMappingSet(split[4]);
    const light2temperature = createMappingSet(split[5]);
    const temperature2humidity = createMappingSet(split[6]);
    const humidity2location = createMappingSet(split[7]);

    const final = seedMap.remap(seed2soil).remap(soil2fertilizer).remap(fertilizer2water).remap(water2light).remap(light2temperature).remap(temperature2humidity).remap(humidity2location);

    let min = Number.POSITIVE_INFINITY;
    for(let i = 0; i < final.mappings.length; ++i) {
        min = Math.min(min, final.mappings[i].dest.begin);
    }

    return min;
}

var input = require("../input/2023/05.js");

console.log(part1());
console.log(part2());