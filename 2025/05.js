import input from "../input/2025/05.js";

/*const input = String.raw`3-5
10-14
16-20
12-18

1
5
8
11
17
32`*/

function solve1() {
    const [rangesUnparsed, availableUnparsed] = input.split('\n\n');
    const ranges = rangesUnparsed.split("\n").map(a => a.split("-").map(Number));
    const available = availableUnparsed.split("\n").map(Number);

    ranges.sort((a, b) => {
        return a[0] - b[0];
    })

    let fresh = 0;

    for(let i = 0; i < available.length; ++i) {
        for(let j = 0; j < ranges.length; ++j) {
            if(ranges[j][0] > available[i]) {
                break;
            }
            if(ranges[j][1] >= available[i]) {
                ++fresh;
                break;
            }
        }
    }

    return fresh;
}

function solve2() {
    const [rangesUnparsed, _] = input.split('\n\n');
    const ranges = rangesUnparsed.split("\n").map(a => a.split("-").map(Number));

    ranges.sort((a, b) => {
        return a[0] - b[0];
    })

    let fresh = 0;

    for(let i = 0; i < ranges.length; ++i) {
        let rangeBegin = ranges[i][0];
        let rangeEnd = ranges[i][1];

        while(i < ranges.length - 1 && rangeEnd >= ranges[i+1][0]) {
            ++i;
            rangeEnd = Math.max(rangeEnd, ranges[i][1]);
        }
        fresh += (rangeEnd - rangeBegin) + 1;
    }

    return fresh;
    
}

console.log(solve1());
console.log(solve2());
