import input from "../input/2025/10.js";
import sum from "../sum.cjs";
import numericSort from "../numeric_sort.js";
import tee from "../tee.cjs";

/*const input = String.raw`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;*/

function solve1() {
    return input.split("\n").map(line => {
        const [lights, ...buttons] = line.split(" ");
        const joltages = buttons.pop();

        const lightValue = parseInt(lights.split("").reverse().join("").slice(1,-1).replaceAll("#",1).replaceAll(".",0), 2);
        const buttonValues = buttons.map(buttons => {
            return buttons.slice(1,-1).split(",").map(Number).map(a => 1 << a).reduce((a,b) => a|b, 0);
        });

        const buttonPowerSet = buttonValues.reduce((powerSet, el) => {
            const newSubsets = powerSet.map(subset => [...subset, el]);
            return [...powerSet, ...newSubsets];
        }, [[]]);

        const filtered = buttonPowerSet.filter(set => (set.reduce((a,b) => a^b, 0) == lightValue));
        if(filtered.length == 0) {
            console.log(lightValue, buttonPowerSet);
            throw new Error("Couldn't do it");
        }

        return buttonPowerSet.filter(set => (set.reduce((a,b) => a^b, 0) == lightValue)).map(a => a.length).sort(numericSort)[0];
    }).reduce(sum, 0);
    
}

function solve2() {
    return input.split("\n").map((line,i,arr) => {
        console.log(`${i}/${arr.length}`);
        const [lights, ...buttonsUnparsed] = line.split(" ");
        const joltages = buttonsUnparsed.pop().slice(1,-1).split(",").map(Number);
        const buttons = buttonsUnparsed.map(buttons => {
            return buttons.slice(1,-1).split(",").map(Number).reduce((changes, button) => {changes[button]=1; return changes}, Array(joltages.length).fill(0));
        });

        let best = Number.POSITIVE_INFINITY;
        console.log("start");
        function calculatePresses(depth, i, val) {
            if(depth >= best) { return; }
            if(val.findIndex(a => a<0) != -1 ) { return; }
            //console.log(depth, i , val);
            if(val.findIndex(a => a!=0) == -1) {
                if(depth < best) {
                    best = depth;
                    console.log("updating best", best);
                }
                return;
            }
            
            for(let j = 0; j < buttons.length; ++j) {
                if(buttons[j][i] && val[i]) {
                    for(let n = val[i]; n >= 0; --n) {
                        //console.log("try1")
                        let newVal = val.map((a, idx) => a - buttons[j][idx] * n);
                        calculatePresses(depth+n, i+1, newVal);
                    }
                } else if (buttons[j][i]) {
                    // skip this button
                    //console.log("try2");
                    calculatePresses(depth, i+1, val);
                }
            }
        }

        calculatePresses(0, 0, joltages);
        return best;
    }).reduce(sum, 0);
}

console.log(solve1());
console.log(solve2());
