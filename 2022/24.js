const {MinPriorityQueue} = require("@datastructures-js/priority-queue");

function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(b, a);
}

function part1() {
    let initialMap = input.split('\n').map(line => line.replace(/^#|#$/g, '').split('')).slice(1, -1);
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
        if(!hasBlizzardAtTime(endPos[0], endPos[1]-1, i)) {
            map[i][endPos[1]-1][endPos[0]].exits.push(endNodes[next]);
        }
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
        if(!hasBlizzardAtTime(0, 0, next)) {
            startNodes[i].exits.push(map[next][0][0]);
        }
        startNodes[i].exits.push(startNodes[next]);
    }

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
            return endPos[0] - n.node.x + endPos[1] - n.node.y;
        }

        return g(node) + h(node);
    });
    let current = {step: 0, node: startNodes[0]};
    while(current.node.x != endPos[0] || current.node.y != endPos[1]) {
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

    return current.step;
}

function part2() {

}

const input2 = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;
const input = `#.####################################################################################################
#>^<.v^^v>>^>vv..<><v.<^<^<v.^>>^<>>><><<>^v^>.^<>><<^vv><^<>>vv^v.<.^v><<<>.<v><<^v<v^<>.<vv<>vv<<v>#
#<v<vv><^>v<><.<<^^<>^>v<^vvvv^<<v<<^.^.^>.<><^><<^v<^><<v>vv<<>>>^.^<>>>^vvv^><^v^^>>><<vvv>><<><><.#
#>.vv^^^<^>v>vvv>^.<v<>...v^<>v<><<..vvv<^<<v>^>^<^v^>><^^v.v>>><^.^>vv^^v>v<^^.vv<v<v<>>^^>v>vvv^v><#
#.<v>^^<^v^^<^>>^>><v>^vv>^<v<v^^<>^v><v<^<>>.v^>^.v^><vvv^.^.>vvv^.v.>.>^<^.<^>><^><v<<v>^^>><><^^^<#
#<^<<v^vvv>>><>^^>>v.v.v^^>^<>><^>>^^><v>v<^.^.v<..>>>.>>.<^<^^^>.<>^^.v^>>>v>v>^^v>^><>><<.^.^>vv^^.#
#<^^>^v><..v^v<^.<vv^v<.<>.<>.^v^>^^>>v^^v.<.^><>^v.^^v>v<^^vv<<^^v<>><>^<v>>^<><v^.>>>>^v.>v.><.>v>>#
#<>.<<v.><^><<>>v><><>^..^v^<v>v<v.<>^<>>^v.^^>>.v^.<v>v>.v.v<>v.<.vv<<^<>^^^^>>.<vv<><<>vv>^>.v^<^>>#
#<.^<vv<><v^^<^v^.<><>v>>>.<<v<<v>>v^..v<<>^>^v>>.<>>v<^>^>^<vvv<><<<..v><<<v>><v<^v^<<^vvv>^>^<v<vv<#
#>^>^v>><<>>.^<>>^.^<v>^>>.<v^>v<<>vv><.v<.^^^>v<v>.v^v^.>>^^^vvvv<^<^<v>^.^<>v<^.^<>v>>vv<>>^^^>v>><#
#>><^<<v<>>^<^>v>v^v><v<v><^v>v>^>^<>>^v>vv^>^v<vv^v>.<^><.vv^^^<^><..<<<>^>^.^>>>^<>.^<^>^<>^^v>v<v>#
#><<><v><v^v>.v>^.<^><^^v><<<<<.^>>.^^<v>v>>^<^<>.^.>>>.>>.^v>v.<^^v^<^<>v<>^^<v^><<^^^<><v^>v>v<^.v<#
#<v>.v<<><vvv^<>^^^<<v<v^v^><v.><<.^^>vvv^>^v>v><><<.v>v<<<><..>>v>>v><^^>^^.^>v.v..>^><^.<>^<<^<<v<<#
#<vv<<vvv<vv>v><<.v<v<><.>^vv.^<<<<<<<v<^<^v^v>.v><vv<v^>^^^.^vv<<v>.<<><>>><^<^.^<>^>^<>v.v.v^><v<<.#
#.>^.>vv<v<><vv^v.^v<.^.v<><>^^>^.>v^<><v<<><vv<<^v>^>v<>^v>v>>v<>^<v.<v^^<<v><<.^<^>.vv.>>^.vv<><v><#
#>>v>>>.v<v<^^>><^^v^>>v>v^>>^<v^^^^.vv.^vv<vv><v^v<>^v<>>>>^^v>^<v<v^<>><>.v>>v..^>..<v<<>.v<<.<^>v<#
#<><^>>v^<^^vv>v<v.>.v.<^v.^>vvv<^>v><^>v><><.v>>.^^>><<>.v^<<^.<.^^.<v><v.^.v<^^^^<^<^>vv<v<.v<<v<^>#
#<<^^<<^vvv<<<<.^vv^.><<vv>v^><>..^.^^v>v>^^<<v>^v.v>^v><>>^v><<.v>v<>^v<v<>v<^v^.^<vv>>^>v>^><<v><.<#
#<<>v.v>...^^.<<^>>.<>^^^v>^<^><v<<<><<vv^.v^>.v^.>>^<v>>^<v^^<v>>vv<<>.>>.v^v><.^v.>^>^><^^v^^v<v>^<#
#<^vv^<><<<v^^<^>>v><^<<v^^v^>>^>v<>.<>>v>v<><v.>v<><<<<.<<.<<>>>><><vv><^v<<<^>v<^<^^<v^><^<..v>.vv>#
#><^>>>.^.>v<^^>>vv<v><^<<v.<.>^<^<^v>vv>v^^><.^.^>>.v.>v^.>>^<>^^^>vvv>..v^vv<^v>>v<><><<<^^<<v>^^<>#
#>^<vv>^v<<.<<v>^><><>>v.>.^<>^^vv<<>>>v^<>>><<v.v>>^<<vv<^vvv><><.v><.vv^v^.v.>vv^<><.v^>vv.<<<v<><<#
#>v<^>>.>>v>v>><^>^>^.^>^>vv>^<<><^v.<vvv<^.><>>v>v>^<>><^>^^<>v>v>.<^v^>>>v^>vvv.>.>^<><>.v^vv><>^>>#
#>><>v^>^>>^>^^>^>^<^>>vv>>>>>>vvv.v>.^v<v<vvv<<>.<^v.vv.v>^>>vv<<v^>^^^^>>^v.^v>>v<vvv<.<>^^<^v<<<.<#
#<>vv<^v>v^<v>>^<<>v^>vvvv>v^><^>^v<v^^^>><^><<.^>v^vv.v<<<>..v<^<.vv>.v>^>>>^^v^v^<^v^<^^<<vv>.>.>><#
#<<<v><>v.><v>><v^<^>><>^<vv><<.<<<<.v^v>v>v>.><>.<v><^.<^>^^><v>vv.<v>.v.>>.^>^>v<^vvvv>><>^^v<^>v>.#
#>.^>^>.<v.v<.<>vv<v<>^v<.>^>v<^v^>.>^<^..v<>>v.v>^.v<^>>^^^<v.<>v><v.^v^.>vv<<^<v^<.^^^.^>>.v>.vv.^.#
#<^v><>.<^v<v<^v<vv^^>.>v^^<v>^<.<^^<<.^>vv^^<^>v<v<^<v^^>vv^v>v^^>>..v^>.<v>v>v<v^<>^<^><.>^>>><<v.<#
#>>^<vv.<<>v.<>v.^>>^^vv^<^>vv<^>v.v>>.^.v^.v<v>^<>^.>><^>v>.>>v^<^>.>>^v<<v<<^^<vvvvv><^>^>v^^^^>^v>#
#<^.>^v>^<>>^.^<>.>..><>.<v^v^vv^>v^..v<<><>>^.^><^^<^^<^v<<^<^>.<><^.>^<^vv^>>>>^^>>><v<<<<^><.>^>.<#
#.v<>><^^vv^<<v^v><<<v<<<v><>><>>v^>v>^^^v<<<<<<>.^v<>.^<><<^vv<^>>v.^><v>v<^v>^v><v>>v<^^>vv.^<^>.>.#
#>^<.>v^^^><<v><>^.>vvv>v^<^>v><<<><><.^>>.>vv.^<<<<<^<^>^>v<^^<^<><v<.<>v<<><<v<^>>v>>>^<>>>.<<^<^<<#
#>^^>.vv^><.>v<vv>^><>v><^<v.<v^>.^><v<v>v^>^<v^v>v<<v^^<^>.^<v<vv<.>>v>v^v.<vv^^^^><v>^<>^v^>vv>>vv>#
#><>^<^^>^>v<^^<vv^<<^>v<>>v^>^v.v.v>^^><^<<<<>v>vv<v>^^<v>>.v<><<^><^^<<>>>>^>v>^>><><^>v><^^><v^^>>#
#><<<v<v><>^vv.^<>^>><v>vv^v^v<<v.v<v^>>vvvv^v<^<v^.><^^v><><v<^^<>><<>v^vv<^>v><>><<<^>>^^<^>><>v<v<#
#>^v><>v<>>^v>^<v^<vv><>^^>>>>v><v^v^>>>v<^<<<<<v<^<>>v><^<<^^^<^<>v<>^<v><^.>>><<^v.<>v^^.>>^^.^>^v<#
####################################################################################################.#`

console.log(part1());