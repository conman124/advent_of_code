const tee = require("../tee.cjs");
const _ = require('underscore');

function part1() {
    let [instructions, nodes] = input.split('\n\n');

    let network = nodes.split("\n")
        .map(a => {
            return a.split(/ = \(|, |\)/g).slice(0, -1)
        }).reduce((prev, cur) => {
            for(let i = 0; i < 3; ++i) {
                if(!prev[cur[i]]) {
                    prev[cur[i]] = {name: cur[i]};
                }
            }
            prev[cur[0]].L = prev[cur[1]];
            prev[cur[0]].R = prev[cur[2]];

            return prev;
        }, {});

    let node = network.AAA;
    let i = 0;

    while(node !== network.ZZZ) {
        node = node[instructions[(i++) % instructions.length]];
    }

    return i;
}

function gcd(a, b) { 
    for (let temp = b; b !== 0;) { 
        b = a % b; 
        a = temp; 
        temp = b; 
    } 
    return a; 
} 
  
function lcm(a, b) { 
    const gcdValue = gcd(a, b); 
    return (a * b) / gcdValue; 
}

function part2() {
    let [instructions, nodesStr] = input.split('\n\n');

    let network = nodesStr.split("\n")
        .map(a => {
            return a.split(/ = \(|, |\)/g).slice(0, -1)
        }).reduce((prev, cur) => {
            for(let i = 0; i < 3; ++i) {
                if(!prev[cur[i]]) {
                    prev[cur[i]] = {name: cur[i]};
                }
            }
            prev[cur[0]].L = prev[cur[1]];
            prev[cur[0]].R = prev[cur[2]];

            return prev;
        }, {});

    let nodes = Object.keys(network).filter(a => (a[2] === 'A')).map(a => network[a]);

    // Note that this would not work for every formulation of this
    // problem, but in this case, the LCM of the number of steps
    // to hit Z for all "ghosts" was the right answer. 

    let counts = _.map(nodes, (node) => {
        let i = 0;
    
        while(node.name[2] !== 'Z') {
            node = node[instructions[(i++) % instructions.length]];
        }
        return i;
    })

    return counts.reduce(lcm, 1);
}

let input = require("../input/2023/08.cjs")

console.log(part1());
console.log(part2());
