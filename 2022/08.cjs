const sum = require('../sum.cjs')

function part1() {
    let trees = input.split('\n').map(a=>a.split('').map(Number));
    let visTrees = new Array();
    for(let i = 0; i < trees.length; ++i) {
        let arr = new Array(trees[0].length);
        arr.fill(false);
        visTrees.push(arr);
    }

    function markVis(startx, starty, offx, offy) {
        let max = -1;
        let x = startx;
        let y = starty;
        while(y >= 0 && y < trees.length && x >= 0 && x < trees[0].length) {
            if(trees[y][x] > max) {
                visTrees[y][x] = true;
                max = trees[y][x];
            }
            x += offx;
            y += offy;
        }
    }
    
    // top + bottom
    for(let i = 0; i < trees[0].length; ++i) {
        markVis(i, 0, 0, 1);
        markVis(i, trees.length-1, 0, -1);
    }

    // left + right
    for(let i = 0; i < trees.length; ++i) {
        markVis(0, i, 1, 0);
        markVis(trees[0].length-1, i, -1, 0);
    }

    return visTrees.map(a=>a.reduce(sum)).reduce(sum);
}

function part2() {
    let trees = input.split('\n').map(a=>a.split('').map(Number));

    function visDistance(startx, starty, offx, offy) {
        let x = startx;
        let y = starty;
        let curHeight = trees[y][x];
        let distance = 0;
        x += offx;
        y += offy;
        while(y >= 0 && y < trees.length && x >= 0 && x < trees[0].length) {
            ++distance;
            if(trees[y][x] < curHeight) {
                
            } else {
                break;
            }
            x += offx;
            y += offy;
        }
        return distance;
    }

    function scenicScore(x, y) {
        return visDistance(x, y, 1, 0) * visDistance(x, y, 0, 1) * visDistance(x, y, -1, 0) * visDistance(x, y, 0, -1);
    }

    let max = 0;
    for(let i = 0; i < trees.length; ++i) {
        for(let j = 0; j < trees[0].length; ++j) {
            max = Math.max(max, scenicScore(j, i));
        }
    }

    return max;
}

const input = require("../input/2022/08.cjs");

console.log(part1());
console.log(part2());
