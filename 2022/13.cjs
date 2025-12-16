const _ = require('underscore');

// -1 means left comes first, 1 means right comes first, 0 means equivalent
function order(left, right) {
    if(_.isNumber(left) && _.isNumber(right)) {
        return left - right;
    }

    if(!_.isArray(left)) {
        left = [left];
    }

    if(!_.isArray(right)) {
        right = [right];
    }

    for(let i = 0; i < left.length; ++i) {
        if(i >= right.length) {
            return 1;
        }

        let ret = order(left[i], right[i]);
        if(ret != 0) {
            return ret;
        }
    }

    if(left.length < right.length) {
        return -1;
    } if(left.length == right.length) {
        return 0;
    } else {
        throw new Error("Logic error, got through order loop with longer left array");
    }
}

function part1() {
    let pairs = input.split("\n\n").map(pair => {
        let split = pair.split('\n');
        return [JSON.parse(split[0]), JSON.parse(split[1])];
    });

    let sum = 0;
    for(let i = 0; i < pairs.length; ++i) {
        let [left, right] = pairs[i];
        if(order(left, right) < 0) {
            sum += i+1;
        }
    }
    return sum;
}

function part2() {
    let all = input.replace(/\n\n/g, '\n').split('\n').map(line => JSON.parse(line));
    let two = [[2]];
    let six = [[6]];
    all.push(two);
    all.push(six);

    all.sort(order);

    return (all.indexOf(two)+1)*(all.indexOf(six)+1);
}

const input = require("../input/2022/13.cjs");

console.log(part1());
console.log(part2());
