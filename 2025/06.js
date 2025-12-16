import input from "../input/2025/06.js";
import sum from "../sum.cjs";
import product from "../product.cjs";
import tee from "../tee.cjs";

function solve1() {
    const problems = input.split("\n")
        .map(a => a.trim().split(/\s+/g));

    const numbers = problems.slice(0, -1);
    const ops = problems[problems.length-1];

    let grandSum = 0;
    for(let i = 0; i < numbers[0].length; ++i) {
        const op = ops[i] == "+" ? sum : product;
        grandSum += numbers.map(a => Number(a[i])).reduce(op, op.identity);
    }
    return grandSum;
}

function solve2() {
    // I'm going to assume that blank numbers should just be treated as though those lines don't exist
    // I don't think this actually comes up in the input
    function solveProblem(start, end) {
        // start and end are inclusive
        const nums = Array(end-start+1);
        for(let i = start; i <= end; ++i) {
            let num = 0;
            for(let j = 0; j < lines.length-1; ++j) {
                if(lines[j][i] == " ") {
                    continue;
                }
                num *= 10;
                num += Number(lines[j][i]);
            }
            nums[i] = num;
        }
        const opStr = lines[lines.length-1].slice(start, end+1).trim();
        const op = opStr === "+" ? sum : product;
        return nums.reduce(op, op.identity);
    }

    const lines = input.split("\n");

    let grandSum = 0;
    for(let left = 0; left < lines[0].length-1; ++left) {
        let right = left+1;
        for(let row = 0; row < lines.length - 1; ++row) {
            while(lines[row][right] !== " " && right < lines[row].length) {
                ++right;
            }
        }
        grandSum += solveProblem(left,right-1);
        left = right;
    }
    return grandSum;
}

console.log(solve1());
console.log(solve2());
