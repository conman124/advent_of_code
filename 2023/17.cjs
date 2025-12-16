const A_star = require("../astar");

function dirToIndex(x,y) {
    // north: 0
    // east: 1
    // south: 2
    // west: 3
    if(y == -1) {
        return 0;
    } else if (x == 1) {
        return 1;
    } else if (y == 1) {
        return 2;
    } else {
        return 3;
    }
}

function inBounds(map, x, y) {
    return x >= 0 && y >= 0 && x < map[0].length && y < map.length;
}

function createNodes(map, minTurn, maxStraight) {
    const nodes = new Array(4).fill(0).map(_=>new Array(maxStraight).fill(0).map(_=>new Array(map.length).fill(0).map(_=>new Array(map[0].length).fill(0).map(_=>({})))));

    let queue = [];
    queue.push([1, 0, 1, 0, 1]);
    queue.push([0, 1, 0, 1, 1]);
    queue.push([0, 0, -1, 0, 1]);
    queue.push([0, 0, 0, -1, 1]);

    while(queue.length) {
        let [x, y, xDir, yDir, countDirection] = queue.pop();

        let direction = dirToIndex(xDir, yDir);
        let myNode = nodes[direction][countDirection-1][y][x];

        if(myNode.neighbors) {
            // already been here
            continue;
        }

        myNode.neighbors = [];
        myNode.x = x;
        myNode.y = y;
        myNode.cost = map[y][x];

        // left:
        if(countDirection >= minTurn) {
            let leftXDir = yDir + 0;
            let leftYDir = -1 * xDir + 0;

            if(inBounds(map, x+leftXDir, y+leftYDir)) {
                let newDirection = dirToIndex(leftXDir, leftYDir);
                myNode.neighbors.push(nodes[newDirection][0][y+leftYDir][x+leftXDir]);

                queue.push([x+leftXDir, y+leftYDir, leftXDir + 0, leftYDir + 0, 1]);
            }
        }

        // right:
        if(countDirection >= minTurn) {
            let rightXDir = -1 * yDir + 0;
            let rightYDir = xDir + 0;

            if(inBounds(map, x+rightXDir, y+rightYDir)) {
                let newDirection = dirToIndex(rightXDir, rightYDir);
                myNode.neighbors.push(nodes[newDirection][0][y+rightYDir][x+rightXDir]);

                queue.push([x+rightXDir, y+rightYDir, rightXDir + 0, rightYDir + 0, 1]);
            }
        }

        // Only allow forward if it's not been too long:
        if(countDirection < maxStraight) {
            if(inBounds(map, x+xDir, y+yDir)) {
                myNode.neighbors.push(nodes[direction][countDirection][y+yDir][x+xDir]);

                queue.push([x+xDir, y+yDir, xDir, yDir, countDirection+1]);
            }
        }
    }

    return nodes;
}

function calculate(minTurn, maxStraight) {
    const map = input.split("\n").map(a=>a.split("").map(Number));

    // structure here is: [direction][travelledInDirection][y][x] = {x, y, neighbors, cost}
    const nodes = createNodes(map, minTurn, maxStraight);

    // east 1
    // south 2
    let start = {neighbors: [nodes[1][0][0][1], nodes[2][0][1][0]], x: 0, y: 0, cost: 0};
    let goal = {cost: 0};

    for(let j = minTurn; j < maxStraight; ++j) {
        // Can't come from south or east, so only use 1 and 2
        nodes[1][j][map.length-1][map[0].length-1].neighbors.push(goal);
        nodes[2][j][map.length-1][map[0].length-1].neighbors.push(goal);
    }

    let goalX = map[0].length-1;
    let goalY = map.length-1;
    let path = A_star(start, goal, ({x,y}) => goalX-x+goalY-y, ({neighbors}) => neighbors, (_, {cost}) => cost);

    let cost = 0;
    for(let i = 0; i < path.length; ++i) {
        cost += path[i].cost;
    }

    return cost;
}

function part1() {
    return calculate(0, 3);
}

function part2() {
    return calculate(4, 10);
}

var input = require("../input/2023/17.cjs");

console.log(part1());
console.log(part2());
