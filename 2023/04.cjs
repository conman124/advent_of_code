const intersection = require("../intersection");
const sum = require("../sum.cjs");
const tee = require("../tee.cjs");

function part1() {
    return input.split('\n')
        .map(a => {
            let split = a.split(/: +/)[1].split(/ +\| +/);
            return [
                new Set(split[0].split(/ +/).map(Number)),
                new Set(split[1].split(/ +/).map(Number))
            ]
        })
        .map(([winning, numbers]) => {
            let won = intersection(winning, numbers).size;
            if(won == 0) {
                return 0;
            } else {
                return Math.pow(2, won-1);
            }
        })
        .reduce(sum)
}

function part2() {
    let cards = input.split('\n')
        .map(a => {
            let split = a.split(/: +/)[1].split(/ +\| +/);
            return [
                new Set(split[0].split(/ +/).map(Number)),
                new Set(split[1].split(/ +/).map(Number))
            ]
        });
        
    let cardsWon = new Array(cards.length);
    cardsWon.fill(1);

    for(let i = 0; i < cards.length; ++i) {
        let won = intersection(cards[i][0], cards[i][1]).size;
        for(let j = 1; j <= won && i + j < cards.length; ++j) {
            cardsWon[i+j] += cardsWon[i];
        }
    }

    return cardsWon.reduce(sum);
}

var input = require("../input/2023/04.cjs")

console.log(part1());
console.log(part2());
