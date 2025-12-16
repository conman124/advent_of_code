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

const input = require("../input/2022/16.cjs");

console.log(part1());
console.log(part2());
