// Shamelessly cropped from pseudocode at https://en.wikipedia.org/wiki/A*_search_algorithm

const {MinHeap} = require("@datastructures-js/heap");

/**
 * 
 * @param {Map<Object, Object>} cameFrom 
 * @param {Object} current 
 * @returns {Object[]}
 */
function reconstruct_path(cameFrom, current) {
    let total_path = [current];
    while(cameFrom.has(current)) {
        current = cameFrom.get(current);
        total_path.push(current);
    }
    total_path.reverse();
    return total_path;
}

/**
 * 
 * @param {Object} start
 * @param {Object} goal 
 * @param {(Object) => number} h 
 * @param {(Object) => Object[]} get_neighbors 
 * @param {(Object, Object) => number} d 
 */
module.exports = function A_star(start, goal, h, get_neighbors, d) {
    let cameFrom = new Map();

    let gScore = new Map();
    gScore.set(start, 0);

    let fScore = new Map();
    fScore.set(start, h(start));

    let openSet = new MinHeap((node) => fScore.get(node));
    openSet.insert(start);

    while(openSet.size()) {
        let current = openSet.extractRoot();

        if(current == goal) {
            return reconstruct_path(cameFrom, current);
        }

        let needFixHeap = false;

        let neighbors = get_neighbors(current);
        for(const neighbor of neighbors) {
            let tentative_gScore = gScore.get(current) + d(current, neighbor);

            if(tentative_gScore < (gScore.has(neighbor) ? gScore.get(neighbor) : Number.POSITIVE_INFINITY)) {
                cameFrom.set(neighbor, current);

                if(fScore.has(neighbor)) {
                    needFixHeap = true;
                }

                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + h(neighbor))
                
                openSet.insert(neighbor);
            }
        }

        if(needFixHeap) {
            openSet.fix();
        }
    }

    throw new Error("No path from start to goal");
}