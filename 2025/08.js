import input from "../input/2025/08.js";
import sum from "../sum.cjs";
import numericSort from "../numeric_sort.js";
import product from "../product.cjs";

/*const input = String.raw`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`*/

const junctions = input.split("\n").map(a => a.split(",").map(Number));
    
function distance(ji, ki) {
    const j = junctions[ji];
    const k = junctions[ki];

    return Math.sqrt(
        Math.pow(j[0]-k[0], 2) +
        Math.pow(j[1]-k[1], 2) +
        Math.pow(j[2]-k[2], 2)
    );
}

class CircuitTracker {
    #circuits = new Set();
    #nodeToCircuit = {};
    
    addConnection(ii, ji) {
        let iCircuit = this.#nodeToCircuit[ii] || new Set([ii]);
        let jCircuit = this.#nodeToCircuit[ji] || new Set([ji]);    
        this.#circuits.delete(iCircuit);
        this.#circuits.delete(jCircuit);
        
        const newCircuit = iCircuit.union(jCircuit);
        this.#circuits.add(newCircuit);
        newCircuit.forEach(a => {
            this.#nodeToCircuit[a] = newCircuit;
        });
    }
    
    getCircuits() {
        return this.#circuits;
    }

    isFullyConnected() {
        return this.#circuits.size == 1 && this.#circuits.values().next().value.size == junctions.length;
    }

    averageCircuitSize() {
        return this.#circuits.values().map(a => a.size).reduce(sum, 0) / this.#circuits.size;
    }

    inSameCircuit(ii, ji) {
        return this.#nodeToCircuit[ii] === this.#nodeToCircuit[ji] && this.#nodeToCircuit[ii];
    }
}

function solve1() {
    const CONNECTION_COUNT = 1000;
    const sorted = Array(CONNECTION_COUNT);
    sorted.fill({distance: Number.POSITIVE_INFINITY});

    for(let j = 0; j < junctions.length; ++j) {
        for(let k = j+1; k < junctions.length; ++k) {
            const newDistance = distance(j, k);
            if(newDistance < sorted[CONNECTION_COUNT-1].distance) {
                // Find where to put the new one.  I'm just going to be lazy and do a
                // linear search, but we can do binary or something if needed
                let i;
                for(i = 0; i < sorted.length; ++i) {
                    // Find the first index my distance is smaller
                    if(newDistance < sorted[i].distance) {
                        sorted.splice(i, 0, {distance: newDistance, j, k});
                        sorted.splice(CONNECTION_COUNT, 1);
                        break;
                    }
                }
            }
        }
    }

    const circuitTracker = new CircuitTracker();
    sorted.forEach(connection => {
        circuitTracker.addConnection(connection.j, connection.k);
    });

    return [...circuitTracker.getCircuits()].map(a => a.size).sort(numericSort).reverse().slice(0,3).reduce(product, 1);
}

function solve2() {
    const BATCH_SIZE = 1000;
    const sorted = Array(BATCH_SIZE);
    const connected = new Set();
    sorted.fill({distance: Number.POSITIVE_INFINITY});
    const circuitTracker = new CircuitTracker();
    let batch = 0;

    while(true) {
        for(let j = 0; j < junctions.length; ++j) {
            for(let k = j+1; k < junctions.length; ++k) {
                if(connected.has(`${j}_${k}`) || connected.has(`${k}_${j}`)) continue;
                if(circuitTracker.inSameCircuit(j, k)) continue;

                const newDistance = distance(j, k);
                if(newDistance < sorted[BATCH_SIZE-1].distance) {
                    // Find where to put the new one.  I'm just going to be lazy and do a
                    // linear search, but we can do binary or something if needed
                    let i;
                    for(i = 0; i < sorted.length; ++i) {
                        // Find the first index my distance is smaller
                        if(newDistance < sorted[i].distance) {
                            sorted.splice(i, 0, {distance: newDistance, j, k});
                            sorted.splice(BATCH_SIZE, 1);
                            break;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < sorted.length; ++i) {
            if(typeof sorted[i].j === "undefined" || typeof sorted[i].k === "undefined") {
                throw new Error("Hit end of list without ending circuit");
            }
            circuitTracker.addConnection(sorted[i].j, sorted[i].k);
            connected.add(`${sorted[i].j}_${sorted[i].k}`);
            if(circuitTracker.isFullyConnected()) {
                const j = sorted[i].j;
                const k = sorted[i].k;
                return junctions[j][0] * junctions[k][0];
            }
        }
        ++batch;

        sorted.fill({distance: Number.POSITIVE_INFINITY});
    }
}

console.log(solve1());
console.log(solve2());
