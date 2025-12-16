const {MinPriorityQueue} = require("@datastructures-js/priority-queue");

function parse() {
    let initialMap = input.split('\n').map(line => line.replace(/^#|#$/g, '').split('')).slice(1, -1);

    function gcd(a, b) {
        return !b ? a : gcd(b, a % b);
    }
    
    function lcm(a, b) {
        return (a * b) / gcd(b, a);
    }

    let startPos = [0, -1]; // x,y
    let endPos = [initialMap[0].length-1, initialMap.length];
    let cyclePeriod = lcm(initialMap.length, initialMap[0].length);

    let map = [];
    let startNodes = [];
    let endNodes = [];
        
    function hasBlizzardAtTime(x, y, time) {
        return initialMap[y][(x+time)%initialMap[0].length] == '<'
            || initialMap[y][((x-time)%initialMap[0].length+initialMap[0].length)%initialMap[0].length] == '>'
            || initialMap[(y+time)%initialMap.length][x] == '^'
            || initialMap[((y-time)%initialMap.length+initialMap.length)%initialMap.length][x] == 'v';    
    }

    // Create nodes
    for(let i = 0; i < cyclePeriod; ++i) {
        let rows = [];
        for(let j = 0; j < initialMap.length; ++j) {
            let cols = [];
            for(let k  = 0; k < initialMap[0].length; ++k) {
                cols.push({
                    x: k,
                    y: j,
                    exits: []
                });
            }
            rows.push(cols);
        }
        map.push(rows);
        startNodes.push({
            x: startPos[0],
            y: startPos[1],
            exits: []
        });
        endNodes.push({
            x: endPos[0],
            y: endPos[1],
            exits: []
        });
    }

    // Create edges
    for(let i = 0; i < cyclePeriod; ++i) {
        let next = (i+1) % cyclePeriod;

        // Add map -> end
        if(!hasBlizzardAtTime(endPos[0], endPos[1]-1, i)) {
            map[i][endPos[1]-1][endPos[0]].exits.push(endNodes[next]);
        }
        // Add end -> map
        if(!hasBlizzardAtTime(endPos[0], endPos[1]-1, next)) {
            endNodes[i].exits.push(map[next][endPos[1]-1][endPos[0]]);
        }
        // Add end -> end
        endNodes[i].exits.push(endNodes[next]);
        // Add map -> map
        for(let y = 0; y < initialMap.length; ++y) {
            for(let x = 0; x < initialMap[0].length; ++x) {
                if(hasBlizzardAtTime(x, y, i)) {
                    continue;
                }

                if(x < initialMap[0].length-1 && !hasBlizzardAtTime(x+1, y, next)) {
                    map[i][y][x].exits.push(map[next][y][x+1]);
                }
                if(y < initialMap.length-1 && !hasBlizzardAtTime(x, y+1, next)) {
                    map[i][y][x].exits.push(map[next][y+1][x]);
                }
                if(x > 0 && !hasBlizzardAtTime(x-1, y, next)) {
                    map[i][y][x].exits.push(map[next][y][x-1]);
                }
                if(y > 0 && !hasBlizzardAtTime(x, y-1, next)) {
                    map[i][y][x].exits.push(map[next][y-1][x]);
                }
                if(!hasBlizzardAtTime(x, y, next)) {
                    map[i][y][x].exits.push(map[next][y][x]);
                }
            }
        }
        // Add map -> start
        if(!hasBlizzardAtTime(0, 0, i)) {
            map[i][0][0].exits.push(startNodes[next]);
        }
        // Add start -> map
        if(!hasBlizzardAtTime(0, 0, next)) {
            startNodes[i].exits.push(map[next][0][0]);
        }
        // Add start -> start
        startNodes[i].exits.push(startNodes[next]);
    }

    return {
        startNodes,
        startPos,
        endPos
    }
}

function search(startNode, [endx, endy], startStep) {
    // Lazy A* search
    // Normally, you need to update the g and f for a node's neighbors
    // if they are better than the first one you found.  However, the only
    // way it could possibly get better is if the search wrapped around
    // the entire blizzard cycle period, which I know is not the case through
    // some experimentation.
    let seen = new Set();
    let queue = new MinPriorityQueue(node => {
        function g(n) {
            return n.step;
        }

        function h(n) {
            return endx - n.node.x + endy - n.node.y;
        }

        return g(node) + h(node);
    });
    let current = {step: startStep, node: startNode};
    while(current.node.x != endx || current.node.y != endy) {
        for(let i = 0; i < current.node.exits.length; ++i) {
            if(!seen.has(current.node.exits[i])) {
                queue.push({
                    step: current.step+1,
                    node: current.node.exits[i]
                });
                seen.add(current.node.exits[i]);
            }
        }

        current = queue.pop();
    }

    return current;
}

function part1() {
    let {
        startNodes,
        endPos,
    } = parse();

    return search(startNodes[0], endPos, 0).step;
}

function part2() {
    let {
        startNodes,
        startPos,
        endPos
    } = parse();

    let toEnd = search(startNodes[0], endPos, 0);
    let toStart = search(toEnd.node, startPos, toEnd.step);
    let toEnd2 = search(toStart.node, endPos, toStart.step);

    return toEnd2.step;
}

const input = require("../input/2022/24.cjs")

console.log(part1());
console.log(part2());
