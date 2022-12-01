const _ = require("underscore");
const input = require("../input/2023/19.js");
const sum = require("../sum.js");

function part1() {
    const [workflowsStr, partsStr] = input.split('\n\n');

    const workflows = {};
    workflowsStr.split("\n").forEach(str => {
        const [name, instructionsStr] = str.split(/[\{\}]/g);
        let instructions = instructionsStr.split(",").map((instruction,i,arr) => {
            if(i == arr.length-1) {
                return () => { return instruction; }
            }
            return ({x,m,a,s}) => {
                let [condition, dest] = instruction.split(":");
                if(eval(condition)) { return dest; }
                return;
            };
        })

        workflows[name] = instructions;
    });

    return partsStr.split("\n").map(a => eval("(" + a.replace(/=/g, ":") + ")")).filter(obj => {
        let workflow = "in";
        while(workflow != "A" && workflow != "R") {
            let fn = _.find(workflows[workflow], f => f(obj));
            workflow = fn(obj);
        }
        return workflow == "A";
    }).map(({x,m,a,s}) => x+m+a+s)
    .reduce(sum, 0)
}

function part2() {
    class Interval {
        constructor(minX, maxX, minM, maxM, minA, maxA, minS, maxS) {
            this.minX = minX;
            this.maxX = maxX;
            this.minM = minM;
            this.maxM = maxM;
            this.minA = minA;
            this.maxA = maxA;
            this.minS = minS;
            this.maxS = maxS;
        }

        get low() {
            return {x: this.minX, m: this.minM, a: this.minA, s: this.minS};
        }

        get high() {
            return {x: this.maxX, m: this.maxM, a: this.maxA, s: this.maxS};
        }

        intersection(other) {
            return new Interval(Math.max(this.minX, other.minX), Math.min(this.maxX, other.maxX), Math.max(this.minM, other.minM), Math.min(this.maxM, other.maxM), Math.max(this.minA, other.minA), Math.min(this.maxA, other.maxA), Math.max(this.minS, other.minS), Math.min(this.maxS, other.maxS));
        }
    }

    const [workflowsStr, garbage] = input.split('\n\n');

    const workflows = {};
    workflowsStr.split("\n").forEach(str => {
        const [name, instructionsStr] = str.split(/[\{\}]/g);
        let instructions = instructionsStr.split(",").map((instruction,i,arr) => {
            if(i == arr.length-1) {
                return [instruction, new Interval(1, 4000, 1, 4000, 1, 4000, 1, 4000), new Interval(-1, -1, -1, -1, -1, -1, -1, -1)];
            }

            let [conditional, dest] = instruction.split(":");
            let variable = conditional[0];
            let operator = conditional[1];
            let constant = parseInt(conditional.slice(2));

            let minXpass, maxXpass, minMpass, maxMpass, minApass, maxApass, minSpass, maxSpass;
            let minXfail, maxXfail, minMfail, maxMfail, minAfail, maxAfail, minSfail, maxSfail;
            minXpass = minMpass = minApass = minSpass = 1;
            maxXpass = maxMpass = maxApass = maxSpass = 4000;
            minXfail = minMfail = minAfail = minSfail = 1;
            maxXfail = maxMfail = maxAfail = maxSfail = 4000;
            switch(variable) {
                case "x": if(operator == "<") { maxXpass = constant-1; minXfail = constant } else { minXpass = constant+1; maxXfail = constant } break;
                case "m": if(operator == "<") { maxMpass = constant-1; minMfail = constant } else { minMpass = constant+1; maxMfail = constant } break;
                case "a": if(operator == "<") { maxApass = constant-1; minAfail = constant } else { minApass = constant+1; maxAfail = constant } break;
                case "s": if(operator == "<") { maxSpass = constant-1; minSfail = constant } else { minSpass = constant+1; maxSfail = constant } break;
                default: throw new Error("bad switch");
            }

            return [dest, new Interval(minXpass, maxXpass, minMpass, maxMpass, minApass, maxApass, minSpass, maxSpass), new Interval(minXfail, maxXfail, minMfail, maxMfail, minAfail, maxAfail, minSfail, maxSfail)];
        });

        workflows[name] = instructions;
    });

    let total = 0;
    function recurse(workflow, interval) {
        if(workflow == "A") {
            let xw = interval.high.x - interval.low.x + 1;
            let mw = interval.high.m - interval.low.m + 1;
            let aw = interval.high.a - interval.low.a + 1;
            let sw = interval.high.s - interval.low.s + 1;

            total += xw * mw * aw * sw;
            return;
        }

        if(workflow == "R") {
            return;
        }

        for(let i = 0; i < workflows[workflow].length; ++i) {
            let [dest, passingInterval, failingInterval] = workflows[workflow][i];

            // Count the part of this that passes:
            recurse(dest, interval.intersection(passingInterval));

            // Try the next rules on the parts that don't pass:
            interval = interval.intersection(failingInterval);
        }
    }

    recurse("in", new Interval(1, 4000, 1, 4000, 1, 4000, 1, 4000))

    return total;
}

console.log(part1());
console.log(part2());