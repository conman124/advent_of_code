const sum = require("../sum");

function part1() {
    function getType(cards) {
        let counts = {};
        for(let i = 0; i < cards.length; ++i) {
            counts[cards[i]] = (counts[cards[i]] || 0) + 1
        }

        let keys = Object.keys(counts);
        if(keys.length == 1) {
            return 6; // Five of a kind
        }
        if(keys.length == 2) {
            if(counts[keys[0]] == 4 || counts[keys[1]] == 4) {
                return 5; // Four of a kind
            }

            return 4; // Full house
        }
        if(keys.length == 3) {
            if(counts[keys[0]] == 3 || counts[keys[1]] == 3 || counts[keys[2]] == 3) {
                return 3; // Three of a kind
            }

            return 2; // Two pair
        }
        if(keys.length == 4) {
            return 1; // One pair
        }
        return 0; // High card
    }

    function sortHands([a], [b]) {
        let typeA = getType(a);
        let typeB = getType(b);
        if(typeA < typeB) {
            return -1;
        } else if (typeA > typeB) {
            return 1;
        }
        
        a = a.replace(/T/g, 'B').replace(/J/g, 'C').replace(/Q/g, 'D').replace(/K/g, 'E').replace(/A/g, 'F');
        b = b.replace(/T/g, 'B').replace(/J/g, 'C').replace(/Q/g, 'D').replace(/K/g, 'E').replace(/A/g, 'F');

        return a.localeCompare(b);
    }

    return input.split("\n")
        .map(a => {let b = a.split(" "); return [b[0], Number(b[1])]; })
        .sort(sortHands)
        .map((a, i) => a[1]*(i+1))
        .reduce(sum)
}

function part2() {
    function getType(cards) {
        // logic may be overcomplicated

        let counts = {};
        let wilds = 0;
        for(let i = 0; i < cards.length; ++i) {
            if(cards[i] == 'J') {
                ++wilds;
            } else {
                counts[cards[i]] = (counts[cards[i]] || 0) + 1
            }
        }

        let keys = Object.keys(counts);
        if(wilds == 5 || wilds == 4 || keys.length == 1) {
            return 6; // Five of a kind
        }
        if(wilds == 3) {
            return 5; // Four of a kind
        }
        if(wilds == 2) {
            if(keys.length == 2) {
                return 5; // Four of a kind
            }
            return 3; // Three of a kind
        }
        if(wilds == 1) {
            if(counts[keys[0]] == 3 || counts[keys[1]] == 3) {
                return 5; // Four of a kind
            }
            if(keys.length == 2) {
                return 4; // Full house
            }
            if(keys.length == 3) {
                return 3; // Three of a kind
            }
            return 1; // One pair 
        }
        if(keys.length == 2) {
            if(counts[keys[0]] == 4 || counts[keys[1]] == 4) {
                return 5; // Four of a kind
            }

            return 4; // Full house
        }
        if(keys.length == 3) {
            if(counts[keys[0]] == 3 || counts[keys[1]] == 3 || counts[keys[2]] == 3) {
                return 3; // Three of a kind
            }

            return 2; // Two pair
        }
        if(keys.length == 4) {
            return 1; // One pair
        }
        return 0; // High card
    }

    function sortHands([a], [b]) {
        let typeA = getType(a);
        let typeB = getType(b);
        if(typeA < typeB) {
            return -1;
        } else if (typeA > typeB) {
            return 1;
        }
        
        a = a.replace(/T/g, 'B').replace(/J/g, '.').replace(/Q/g, 'D').replace(/K/g, 'E').replace(/A/g, 'F');
        b = b.replace(/T/g, 'B').replace(/J/g, '.').replace(/Q/g, 'D').replace(/K/g, 'E').replace(/A/g, 'F');

        return a.localeCompare(b);
    }

    return input.split("\n")
        .map(a => {let b = a.split(" "); return [b[0], Number(b[1])]; })
        .sort(sortHands)
        .map((a, i) => a[1]*(i+1))
        .reduce(sum)

}

var input = require("../input/2023/07.js");

console.log(part1());
console.log(part2());
