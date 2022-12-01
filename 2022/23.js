function both() {
    function coordToKey(x, y) {
        return `${x},${y}`;
    }

    function keyToCoord(coord) {
        return coord.split(',').map(Number);
    }

    let elfCount = 0;
    let currentPositions = new Set();
    input.split('\n').forEach((line, y) => line.split('').forEach((point, x) => {
        if(point == '#') {
            ++elfCount;
            currentPositions.add(coordToKey(x,y));
        }
    }));

    function checkDir([x, y], offsets) {
        return !currentPositions.has(coordToKey(x+offsets[0][0], y+offsets[0][1]))
            && !currentPositions.has(coordToKey(x+offsets[1][0], y+offsets[1][1]))
            && !currentPositions.has(coordToKey(x+offsets[2][0], y+offsets[2][1]));
    }

    function allEmpty([x, y]) {
        return !currentPositions.has(coordToKey(x-1, y-1))
            && !currentPositions.has(coordToKey(x  , y-1))
            && !currentPositions.has(coordToKey(x+1, y-1))
            && !currentPositions.has(coordToKey(x-1, y  ))
            && !currentPositions.has(coordToKey(x+1, y  ))
            && !currentPositions.has(coordToKey(x-1, y+1))
            && !currentPositions.has(coordToKey(x  , y+1))
            && !currentPositions.has(coordToKey(x+1, y+1));
    }

    const offsets = [
        [[-1, -1], [ 0, -1], [ 1, -1]],
        [[-1,  1], [ 0,  1], [ 1,  1]],
        [[-1, -1], [-1,  0], [-1,  1]],
        [[ 1, -1], [ 1,  0], [ 1,  1]]
    ];

    let i = 0;
    while(true) {
        let proposedMoves = new Map(); // Map from starting position to proposed position
        let proposedCounts = new Map(); // Map from proposed position to count of elves that proposed

        currentPositions.forEach(pos => {
            let [x,y] = keyToCoord(pos);
            if(!allEmpty([x,y])) {
                for(let j = 0; j < 4; ++j) {
                    let dir = (j + i) % 4;
                    if(checkDir([x,y], offsets[dir])) {
                        let newCoord = coordToKey(x+offsets[dir][1][0], y+offsets[dir][1][1]);
                        let count = proposedCounts.get(newCoord) || 0;
                        ++count;
                        proposedCounts.set(newCoord, count);
                        proposedMoves.set(pos, newCoord);
                        break;
                    }
                }
            }
        });

        let moved = 0;
        proposedMoves.forEach((newPos, oldPos) => {
            if(proposedCounts.get(newPos) == 1) {
                ++moved;
                currentPositions.delete(oldPos);
                currentPositions.add(newPos);
            }
        });

        ++i;
        
        if(moved == 0) {
            console.log(i);
            break;
        }

        if(i == 10) {
            let minX = Number.POSITIVE_INFINITY;
            let minY = Number.POSITIVE_INFINITY;
            let maxX = Number.NEGATIVE_INFINITY;
            let maxY = Number.NEGATIVE_INFINITY;
        
            currentPositions.forEach(pos => {
                let [x, y] = keyToCoord(pos);
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x+1);
                maxY = Math.max(maxY, y+1);
            });
        
            let area = (maxX - minX) * (maxY - minY);
            console.log(area - elfCount);
        }
    }
}

const input = require("../input/2022/23.js");

both();