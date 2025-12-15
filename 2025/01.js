function solve1() {
    return input.split("\n")
        .map(a => [a[0], Number(a.slice(1))])
        .reduce(([pos, count0], [dir,count]) => {
            if(dir == "L") {
                count *= -1;
            }
            const newPos = (pos+count+100)%100;

            return [newPos, count0 + (newPos == 0 ? 1 : 0)];
        }, [50, 0])[1];
}

function solve2() {
    return input.split("\n")
        .map(a => [a[0], Number(a.slice(1))])
        .reduce(([pos, count0], [dir,count]) => {
            let wrapCount = Math.floor(count / 100);
            count = count % 100;
            if(dir == "L") {
                count *= -1;
            }
            const newPosUnwrapped = pos + count;
            if(newPosUnwrapped > 100 || (newPosUnwrapped < 0 && pos != 0)) {
                ++wrapCount;
            }
            const newPos = ((newPosUnwrapped%100)+100)%100;

            return tee([newPos, count0 + (newPos == 0 ? 1 : 0) + wrapCount ]);
        }, [50, 0])[1];

}

const input = require("../input/2025/01.js");
const tee = require("../tee.js");

console.log(solve1());
console.log(solve2());
