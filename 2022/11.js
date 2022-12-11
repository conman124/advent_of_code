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

const input = `Monkey 0:
  Starting items: 64
  Operation: new = old * 7
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 1:
  Starting items: 60, 84, 84, 65
  Operation: new = old + 7
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 7

Monkey 2:
  Starting items: 52, 67, 74, 88, 51, 61
  Operation: new = old * 3
  Test: divisible by 5
    If true: throw to monkey 5
    If false: throw to monkey 7

Monkey 3:
  Starting items: 67, 72
  Operation: new = old + 3
  Test: divisible by 2
    If true: throw to monkey 1
    If false: throw to monkey 2

Monkey 4:
  Starting items: 80, 79, 58, 77, 68, 74, 98, 64
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 6
    If false: throw to monkey 0

Monkey 5:
  Starting items: 62, 53, 61, 89, 86
  Operation: new = old + 8
  Test: divisible by 11
    If true: throw to monkey 4
    If false: throw to monkey 6

Monkey 6:
  Starting items: 86, 89, 82
  Operation: new = old + 2
  Test: divisible by 7
    If true: throw to monkey 3
    If false: throw to monkey 0

Monkey 7:
  Starting items: 92, 81, 70, 96, 69, 84, 83
  Operation: new = old + 4
  Test: divisible by 3
    If true: throw to monkey 4
    If false: throw to monkey 5`;

console.log(part1());
console.log(part2());
