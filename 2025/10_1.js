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

console.log(solve1());
