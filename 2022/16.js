const _ = require('underscore')

function ensureUndirected(valves) {
    let keys = Object.keys(valves);
    for(let i = 0; i < keys.length; ++i) {
        let exits = Object.keys(valves[keys[i]].exits);
        for(let j = 0; j < exits.length; ++j) {
            if(!valves[exits[j]].exits[keys[i]]) {
                throw new LogicError("graph is not undirected")
            }
        }
    }
}

// Returns all the combinations of 2 distinct elements of arr
function combinations(arr) {
    let ret = [];
    for(let i = 0; i < arr.length; ++i) {
        for(let j = 0; j < arr.length; ++j) {
            if(i == j) { continue; }

            ret.push([arr[i], arr[j]]);
        }
    }
    return ret;
}

function collapseGraph(valves) {
    let keys = Object.keys(valves);
    for(let i = 0; i < keys.length; ++i) {
        let name = keys[i];
        if(name == 'AA') {
            continue;
        }

        if(!valves[name] || valves[name].rate != 0) {
            continue;
        }

        let combos = combinations(Object.keys(valves[name].exits));

        for(let j = 0; j < combos.length; ++j) {
            let [from, to] = combos[j];
            let newVal = valves[from].exits[name] + valves[name].exits[to];
            let oldVal = valves[from].exits[to] || Number.POSITIVE_INFINITY;

            if(newVal < oldVal) {
                valves[from].exits[to] = newVal;
            }

            delete valves[from].exits[name];
            delete valves[name].exits[to];

            if(Object.keys(valves[from].exits).length == 0) {
                delete valves[from];
            }
            if(Object.keys(valves[name].exits).length == 0) {
                delete valves[name];
            }
        }
    }
}

// I'm lazy and don't feel like implementing a priority queue for Dijkstra's, so this just does a full search
// If it turns out to be the bottleneck, I'll reimplement...
function buildShortestPaths(valves) {
    let ret = {};

    let combos = combinations(Object.keys(valves));

    let best = Number.POSITIVE_INFINITY;
    function find(current, goal, visited, cost) {
        if(current == goal) {
            if(best > cost) { best = cost; }
            return cost;
        }

        let myBest = Number.POSITIVE_INFINITY;
        let exits = Object.keys(valves[current].exits);
        for(let i = 0; i < exits.length; ++i) {
            if(!visited.has(exits[i])) {
                myBest = Math.min(myBest, find(exits[i], goal, new Set(visited).add(exits[i]), cost + valves[current].exits[exits[i]]));
            }
        }

        return myBest;
    }

    for(let i = 0; i < combos.length; ++i) {
        let costs = ret[combos[i][0]] || {};
        ret[combos[i][0]] = costs;
        costs[combos[i][1]] = find(combos[i][0], combos[i][1], new Set(), 0);
    }

    return ret;
}

function getMaxFlowPart1(valves, shortestsPaths, bestMinute) {
    const MINUTES = 30;
    let best = 0;
    
    function recurse(remaining, minute, currentValve, previousFlow, currentFlow, tag = "") {
        if(minute >= MINUTES) {
            if(previousFlow > best) {
                best = previousFlow;
            }
            return;
        }

        if(remaining.size == 0) {
            let ret = previousFlow + currentFlow * (MINUTES - minute);
            if(ret > best) {
                best = ret;
            }
            return;
        }

        if(previousFlow + bestMinute * (MINUTES - minute) < best) {
            return;
        }

        for(let valve of remaining) {
            let newSet = new Set(remaining);
            newSet.delete(valve);
            let travelTime = shortestsPaths[currentValve][valve];
            let timeRemaining = MINUTES - minute;
            if(timeRemaining < travelTime+1) {
                recurse(remaining, minute + timeRemaining, valve, previousFlow+currentFlow*timeRemaining, currentFlow, tag);
            } else {
                recurse(newSet, minute+1+travelTime, valve, previousFlow+currentFlow*(travelTime+1), currentFlow+valves[valve].rate, tag + " " + valve);
            }
        }
    }

    let remaining = new Set(Object.keys(valves));
    remaining.delete('AA');
    recurse(remaining, 0, 'AA', 0, 0);

    return best;
}

function getMaxFlowPart2(valves, shortestPaths, bestMinute) {
    const MINUTES = 26;
    let best = 0;
    
    function recurse(remaining, minute, nextValveMe, timeLeftMe, nextValveElephant, timeLeftElephant, previousFlow, currentFlow, myTag = "", elephantTag = "") {
        previousFlow += currentFlow;

        if(minute >= MINUTES) {
            if(previousFlow > best) {
                best = previousFlow;
            }
            return;
        }

        if(remaining.size == 0) {
            let myNewFlow = Math.max(0, MINUTES - minute - timeLeftMe) * valves[nextValveMe].rate;
            let elephantNewFlow = Math.max(0, MINUTES - minute - timeLeftElephant) * valves[nextValveElephant].rate;
            let ret = previousFlow + currentFlow * (MINUTES - minute) + myNewFlow + elephantNewFlow;
            if(ret > best) {
                best = ret;
            }
            return;
        }

        if(previousFlow + bestMinute * (MINUTES - minute) < best) {
            return;
        }

        let combos;
        let changeMe = false;
        let changeElephant = false;
        if(timeLeftMe == 0 && timeLeftElephant == 0) {
            combos = combinations(Array.from(remaining));
            changeMe = true;
            changeElephant = true;
        } else if(timeLeftMe == 0) {
            let r = Array.from(remaining);
            combos = _.zip(r, new Array(r.length).fill(nextValveElephant));
            changeMe = true;
        } else if(timeLeftElephant == 0) {
            let r = Array.from(remaining);
            combos = _.zip(new Array(r.length).fill(nextValveMe), r);
            changeElephant = true;
        } else {
            combos = [[nextValveMe, nextValveElephant]];
        }

        for(let [newNextMe, newNextElephant] of combos) {
            let newTimeMe = timeLeftMe-1;
            let newTimeElephant = timeLeftElephant-1;
            let newCurrentFlow = currentFlow;
            let newPreviousFlow = previousFlow;
            let newRemaining = new Set(remaining);
            let newMyTag = myTag;
            let newElephantTag = elephantTag;
            if(changeMe) {
                newRemaining.delete(newNextMe);
                newTimeMe = shortestPaths[nextValveMe][newNextMe];
                if(nextValveMe != 'AA') {
                    newCurrentFlow += valves[nextValveMe].rate;
                    newMyTag += `${nextValveMe} `;
                }
            }
            if(changeElephant) {
                newRemaining.delete(newNextElephant);
                newTimeElephant = shortestPaths[nextValveElephant][newNextElephant];
                if(nextValveElephant != 'AA') {
                    newCurrentFlow += valves[nextValveElephant].rate;
                    newElephantTag += `${nextValveElephant} `;
                }
            }

            recurse(newRemaining, minute + 1, newNextMe, newTimeMe, newNextElephant, newTimeElephant, newPreviousFlow, newCurrentFlow, newMyTag, newElephantTag);
        }
    }

    let remaining = new Set(Object.keys(valves));
    remaining.delete('AA');
    recurse(remaining, 0, 'AA', 0, 'AA', 0, 0, 0);

    return best;
}

function simulate(callback) {
    let valves = input.split('\n').map(line => {
        let match = line.match(/Valve (..) has flow rate=(\d+); tunnels? leads? to valves? ((.., )*(..))$/);

        let name = match[1];
        let rate = parseInt(match[2]);
        let exits = match[3].split(', ').reduce((memo, exit) => {memo[exit] = 1; return memo;}, {});

        return [name, rate, exits];
    }).reduce((memo, [name, rate, exits]) => {
        memo[name] = {
            rate,
            exits
        };
        return memo;
    }, {});

    ensureUndirected(valves);

    collapseGraph(valves);

    let shortestPaths = buildShortestPaths(valves);

    let bestMinute = 0;
    let keys = Object.keys(valves);
    for(let i = 0; i < keys.length; ++i) {
        bestMinute += valves[keys[i]].rate;
    }

    return callback(valves, shortestPaths, bestMinute);
}

function part1() {
    return simulate(getMaxFlowPart1);
}

function part2() {
    return simulate(getMaxFlowPart2);
}

const input2 = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`

const input = `Valve AV has flow rate=0; tunnels lead to valves AX, PI
Valve JI has flow rate=0; tunnels lead to valves VD, HF
Valve FF has flow rate=0; tunnels lead to valves ZL, CG
Valve CG has flow rate=10; tunnels lead to valves TI, SU, RV, FF, QX
Valve RC has flow rate=18; tunnels lead to valves EQ, WR, AD
Valve ZJ has flow rate=0; tunnels lead to valves GJ, WI
Valve GJ has flow rate=21; tunnels lead to valves TG, YJ, EU, AZ, ZJ
Valve VJ has flow rate=0; tunnels lead to valves UJ, AA
Valve ER has flow rate=0; tunnels lead to valves QO, ZK
Valve QO has flow rate=24; tunnels lead to valves MF, ER
Valve LN has flow rate=0; tunnels lead to valves ZR, TI
Valve SU has flow rate=0; tunnels lead to valves CG, LM
Valve AJ has flow rate=12; tunnels lead to valves QX, JW, TR, MK
Valve YJ has flow rate=0; tunnels lead to valves GJ, EQ
Valve JW has flow rate=0; tunnels lead to valves YI, AJ
Valve WI has flow rate=13; tunnels lead to valves XO, ZJ, ZL
Valve VS has flow rate=0; tunnels lead to valves XL, VD
Valve TI has flow rate=0; tunnels lead to valves LN, CG
Valve VD has flow rate=17; tunnels lead to valves TR, VS, JI, GQ, VO
Valve TX has flow rate=0; tunnels lead to valves FV, WR
Valve HP has flow rate=0; tunnels lead to valves AX, ET
Valve BK has flow rate=0; tunnels lead to valves PI, AD
Valve ET has flow rate=0; tunnels lead to valves ZR, HP
Valve VY has flow rate=0; tunnels lead to valves KU, LM
Valve DZ has flow rate=0; tunnels lead to valves VO, AA
Valve ZK has flow rate=0; tunnels lead to valves FR, ER
Valve TG has flow rate=0; tunnels lead to valves GJ, AX
Valve YI has flow rate=0; tunnels lead to valves JW, LM
Valve XO has flow rate=0; tunnels lead to valves ZR, WI
Valve ZR has flow rate=11; tunnels lead to valves KX, AZ, ET, LN, XO
Valve EQ has flow rate=0; tunnels lead to valves RC, YJ
Valve PI has flow rate=4; tunnels lead to valves BK, KX, VQ, EU, AV
Valve VO has flow rate=0; tunnels lead to valves VD, DZ
Valve WR has flow rate=0; tunnels lead to valves TX, RC
Valve TF has flow rate=0; tunnels lead to valves FR, KU
Valve FR has flow rate=22; tunnels lead to valves ZK, TF
Valve MK has flow rate=0; tunnels lead to valves AJ, YW
Valve AZ has flow rate=0; tunnels lead to valves GJ, ZR
Valve TC has flow rate=0; tunnels lead to valves KU, RO
Valve GQ has flow rate=0; tunnels lead to valves MF, VD
Valve YW has flow rate=0; tunnels lead to valves MK, KU
Valve AA has flow rate=0; tunnels lead to valves RO, EI, VJ, VQ, DZ
Valve MF has flow rate=0; tunnels lead to valves QO, GQ
Valve ZL has flow rate=0; tunnels lead to valves WI, FF
Valve LM has flow rate=3; tunnels lead to valves YI, SU, UJ, VY, HF
Valve KU has flow rate=9; tunnels lead to valves XL, TC, TF, VY, YW
Valve FV has flow rate=23; tunnels lead to valves KV, TX
Valve EU has flow rate=0; tunnels lead to valves PI, GJ
Valve KV has flow rate=0; tunnels lead to valves FV, OF
Valve QX has flow rate=0; tunnels lead to valves AJ, CG
Valve RO has flow rate=0; tunnels lead to valves AA, TC
Valve TR has flow rate=0; tunnels lead to valves VD, AJ
Valve VQ has flow rate=0; tunnels lead to valves AA, PI
Valve HF has flow rate=0; tunnels lead to valves JI, LM
Valve RV has flow rate=0; tunnels lead to valves EI, CG
Valve KX has flow rate=0; tunnels lead to valves PI, ZR
Valve UJ has flow rate=0; tunnels lead to valves LM, VJ
Valve AX has flow rate=5; tunnels lead to valves TG, AV, HP
Valve XL has flow rate=0; tunnels lead to valves KU, VS
Valve AD has flow rate=0; tunnels lead to valves BK, RC
Valve EI has flow rate=0; tunnels lead to valves RV, AA
Valve OF has flow rate=19; tunnel leads to valve KV`;

console.log(part1());
console.log(part2());