const assert = require('assert');
const sum = require('../sum.cjs');

function fromSnafu(snafu) {
    let num = 0;
    for(let i = 0; i < snafu.length; ++i) {
        num *= 5;
        num += {
            "=": -2,
            "-": -1,
            "0": 0,
            "1": 1,
            "2": 2
        }[snafu[i]];
    }
    return num;
}

function toSnafu(num) {
    let snafu = "";
    while(num) {
        num += 2;
        let mod = num % 5;
        snafu = ["=", "-", "0", "1", "2"][mod] + snafu;
        num = Math.floor(num / 5);
    }
    return snafu;
}

function tests() {
    assert.equal(1, fromSnafu("1"));
    assert.equal(1, fromSnafu("1"));
    assert.equal(2, fromSnafu("2"));
    assert.equal(3, fromSnafu("1="));
    assert.equal(4, fromSnafu("1-"));
    assert.equal(5, fromSnafu("10"));
    assert.equal(6, fromSnafu("11"));
    assert.equal(7, fromSnafu("12"));
    assert.equal(8, fromSnafu("2="));
    assert.equal(9, fromSnafu("2-"));
    assert.equal(10, fromSnafu("20"));
    assert.equal(15, fromSnafu("1=0"));
    assert.equal(20, fromSnafu("1-0"));
    assert.equal(2022, fromSnafu("1=11-2"));
    assert.equal(12345, fromSnafu("1-0---0"));
    assert.equal(314159265, fromSnafu("1121-1110-1=0"));

    assert.equal(toSnafu(1), "1");
    assert.equal(toSnafu(1), "1");
    assert.equal(toSnafu(2), "2");
    assert.equal(toSnafu(3), "1=");
    assert.equal(toSnafu(4), "1-");
    assert.equal(toSnafu(5), "10");
    assert.equal(toSnafu(6), "11");
    assert.equal(toSnafu(7), "12");
    assert.equal(toSnafu(8), "2=");
    assert.equal(toSnafu(9), "2-");
    assert.equal(toSnafu(10), "20");
    assert.equal(toSnafu(15), "1=0");
    assert.equal(toSnafu(20), "1-0");
    assert.equal(toSnafu(2022), "1=11-2");
    assert.equal(toSnafu(12345), "1-0---0");
    assert.equal(toSnafu(314159265), "1121-1110-1=0");
}

function part1() {
    return toSnafu(input.split('\n').map(fromSnafu).reduce(sum));
}

const input = require("../input/2022/25.cjs");

console.log(part1());
