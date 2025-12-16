const sum = require('../sum.cjs');

function solveBase() {
  return input
    .split("\n\n")
    .map(cals => cals
      .split('\n')
      .map(cal=>parseInt(cal))
      .reduce(sum)
    )
    .sort((a,b)=>a-b);
}

function solve1() {
  return solveBase().pop();
}

function solve2() {
  return solveBase()
    .slice(-3)
    .reduce(sum);
}

var input = require("../input/2022/01.cjs")

console.log(solve1());
console.log(solve2());
