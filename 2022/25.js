const assert = require('assert');
const sum = require('./sum');

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

const input = `1==02
1=--0-2==10
10221=-0==-2122==
1---=02-112
1=01=2=2-1=1=1102
1=---220==
10
12===0
1=2020200
10--
102
11-0=0-2
1=2-=20-1-=-=20-2112
1=-22-2202000-=2=0
2-0==122=10000002
1=-110-=1-02=1
10212-102
2--202=2=
1=-11=
210==-1
21-1=002211
1-=10-010=020
1=2-0002-1=
22=0200020--2-
10-=22=--1-0
21211120=
220=1120-222221
1020-=01=-1==2
1==00-2-210-=-2=2-0
2122-
2122=2
2
1===-2
220-11=0
1021
1==2=--12=21-=
1==
11102=
11-02-=1-1=-
21=1=2-01=0001=-
2--0110022112000=
12-2=--11=-021=2-
1=01=2
210
1=121=-=1=-
21
10==1
20220-20-0--0
122-=
1=1121220-02102-2
21=-001110122=0-=
1=2-=1
12-=122-2110=1021-
1=2=2=0=1-===
21--21=-0210==
1200
10=2-222011-0-0=
10-==20==
1===221
12=2-1-2-=020-
20=00000010-
20-1-02200
112-2
2122=0-1===2
2121-01--10=1-
2=0220==0-0
10-10111120211
1=21=002-002010021
1-=1=-
1=2000122-0==
2=1101=110210-1
21-==-01211120
1=0==-===0==-21100
10-0
2=-=02=0
2=2
2=-2100-=2--01--
1110
100
101=120==20--1
1012=01--2-
222-0
121-1=1221-==00=1-
1-20=00=0=
110-1010212-01
101=2220=000=21=
2-
1==0-11=1-2=2=0
1=-11=1221-10--121
2-0=2-1100220--0210
1-22-2=
10011-=
10222-2-20101
211
112
1=-
100=2=-0=
1=1
21-221--22--1
1--=1101==02100
21-11=-102111
1022
1=1=211=--
10=1-----
1-1-
222-1-1
11=2=-22==2---0-
1=-=2-==2=
2=2122-
10-==112-02-22-02-=
202=-0
2=
2=00=2=211
2-1-2====1-=-
1=1=1211--=`;

console.log(part1());