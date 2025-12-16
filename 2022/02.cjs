const sum = require("../sum.cjs");

function solve1() {
  return input.split('\n').map(game => {
    let [theirs, mine] = game.split(' ');
    let score = 0;
    if(mine == 'X') {
      score += 1;
    } else if (mine == 'Y') {
      score += 2;
    } else if (mine == 'Z') {
      score += 3;
    }

    // Draw
    if(theirs == 'A' && mine == 'X'
      || theirs == 'B' && mine == 'Y'
      || theirs == 'C' && mine == 'Z') {
        score += 3;
    } else if(theirs == 'A' && mine == 'Y'
      || theirs == 'B' && mine == 'Z'
      || theirs == 'C' && mine == 'X') {
        score += 6;
    }

    return score;
  }).reduce(sum)
};

function solve2() {
  return input.split('\n').map(game => {
    let [theirs, outcome] = game.split(' ');
    let score = 0;
    
    let pts = {'A': 1, 'B': 2, 'C': 3};
    
    if(outcome == 'X') {
      score += 0;
      let mine;
      if(theirs == 'A') { mine = 'C'; }
      else if(theirs == 'B') { mine = 'A'; }
      else { mine = 'B'; }

      score += pts[mine];
    } else if (outcome == 'Y') {
      score += 3;
      score += pts[theirs];
    } else if (outcome == 'Z') {
      score += 6;
      let mine;
      if(theirs == 'A') { mine = 'B'; }
      else if(theirs == 'B') { mine = 'C'; }
      else { mine = 'A'; }
      
      score += pts[mine];
    }
    
    return score;
  }).reduce(sum)
};

const input = require("../input/2022/02.cjs");

console.log(solve1());
console.log(solve2());
