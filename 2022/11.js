class Monkey {
    items;
    divisbleBy;
    #operation;
    #trueDest;
    #falseDest;
    inspections;

    constructor(str) {
        const lines = str.split('\n');
        this.items = lines[1].match(/  Starting items: (.+)$/)[1].split(", ").map(Number);
        this.#operation = lines[2].match(/  Operation: (.+)$/)[1].replace("new", "newval");
        this.divisbleBy = parseInt(lines[3].match(/  Test: divisible by (\d+)/)[1]);
        this.#trueDest = parseInt(lines[4].match(/    If true: throw to monkey (\d+)/)[1]);
        this.#falseDest = parseInt(lines[5].match(/    If false: throw to monkey (\d+)/)[1]);
        this.inspections = 0;
    }

    doRound(otherMonkeys, worryDivisor, mod = 1) {
        while(this.items.length > 0) {
            ++this.inspections;
            let old = this.items.shift();
            let newval;
            eval(this.#operation); // Because I am a lazy bad person
            newval = Math.floor(newval / worryDivisor);
            newval = newval % mod;
            if(newval % this.divisbleBy == 0) {
                otherMonkeys[this.#trueDest].items.push(newval);
            } else {
                otherMonkeys[this.#falseDest].items.push(newval);
            }
        }
    }

    static parse(str) {
        return new Monkey(str);
    }
}

function runSimulation(worryDivisor, rounds) {
    let monkeys = input.split('\n\n').map(Monkey.parse);
    let mod = monkeys.map(a=>a.divisbleBy).reduce((a,b)=>a*b);

    for(let i = 0; i < rounds; ++i) {
        monkeys.forEach(monkey => monkey.doRound(monkeys, worryDivisor, mod));
    }

    monkeys.sort((a,b) => b.inspections - a.inspections);

    console.log(monkeys.map(a=>a.inspections));

    return monkeys[0].inspections * monkeys[1].inspections;
}

function part1() {
    return runSimulation(3, 20);
}

function part2() {
    return runSimulation(1, 10000);
}

const input = require("../input/2022/11.js");

console.log(part1());
console.log(part2());
