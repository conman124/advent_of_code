// Yeah there's probably a better way to deal with this than hardcoding the part types, but it seemed easier
function canDrop(type, [posx, posy], arr) {
    switch(type) {
        case 0:
            if(posy == 0) {
                return false;
            }
            return !arr[posy-1][posx] && !arr[posy-1][posx+1] && !arr[posy-1][posx+2] && !arr[posy-1][posx+3];
        case 1:
            if(posy <= 2) {
                return false;
            }
            return !arr[posy-2][posx] && !arr[posy-3][posx+1] && !arr[posy-2][posx+2];
        case 2:
            if(posy <= 2) {
                return false;
            }
            return !arr[posy-3][posx] && !arr[posy-3][posx+1] && !arr[posy-3][posx+2];
        case 3:
            if(posy <= 3) {
                return false;
            }
            return !arr[posy-4][posx];
        case 4:
            if(posy <= 1) {
                return false;
            }
            return !arr[posy-2][posx] && !arr[posy-2][posx+1];
        default:
            throw new Error("bad type")
    }
}

function canGoLeft(type, [posx, posy], arr) {
    if(posx <= 0) {
        return false;
    }

    switch(type) {
        case 0:
            return !arr[posy][posx-1];
        case 1:
            return !arr[posy][posx] && !arr[posy-1][posx-1] && !arr[posy-2][posx];
        case 2:
            return !arr[posy][posx+1] && !arr[posy-1][posx+1] && !arr[posy-2][posx-1];
        case 3:
            return !arr[posy][posx-1] && !arr[posy-1][posx-1] && !arr[posy-2][posx-1] && !arr[posy-3][posx-1];
        case 4:
            return !arr[posy][posx-1] && !arr[posy-1][posx-1];
        default:
            throw new Error("bad type")
    }
}

function canGoRight(type, [posx, posy], arr) {
    switch(type) {
        case 0:
            if(posx >= 3) {
                return false;
            }
            return !arr[posy][posx+4];
        case 1:
            if(posx >= 4) {
                return false;
            }
            return !arr[posy][posx+2] && !arr[posy-1][posx+3] && !arr[posy-2][posx+2];
        case 2:
            if(posx >= 4) {
                return false;
            }
            return !arr[posy][posx+3] && !arr[posy-1][posx+3] && !arr[posy-2][posx+3];
        case 3:
            if(posx >= 6) {
                return false;
            }
            return !arr[posy][posx+1] && !arr[posy-1][posx+1] && !arr[posy-2][posx+1] && !arr[posy-3][posx+1];
        case 4:
            if(posx >= 5) {
                return false;
            }
            return !arr[posy][posx+2] && !arr[posy-1][posx+2];
        default:
            throw new Error("bad type")
    }
}

function solidifyPart(type, [posx, posy], arr) {
    switch(type) {
        case 0:
            arr[posy][posx] = arr[posy][posx+1] = arr[posy][posx+2] = arr[posy][posx+3] = 1;
            break;
        case 1:
            arr[posy][posx+1] = arr[posy-1][posx] = arr[posy-1][posx+1] = arr[posy-1][posx+2] = arr[posy-2][posx+1] = 1;
            break;
        case 2:
            arr[posy][posx+2] = arr[posy-1][posx+2] = arr[posy-2][posx+2] = arr[posy-2][posx+1] = arr[posy-2][posx] = 1;
            break;
        case 3:
            arr[posy][posx] = arr[posy-1][posx] = arr[posy-2][posx] = arr[posy-3][posx] = 1;
            break;
        case 4:
            arr[posy][posx] = arr[posy][posx+1] = arr[posy-1][posx] = arr[posy-1][posx+1] = 1;
            break;
        default:
            throw new Error("bad type")            
    }
}

function getPartHeight(type) {
    switch(type) {
        case 0:
            return 1;
        case 1:
        case 2:
            return 3;
        case 3:
            return 4;
        case 4:
            return 2;
        default:
            throw new Error("bad type");
    }
}

function getTop(arr) {
    let top = arr.length-1;
    while(top >= 0) {
        if(arr[top].includes(1)) {
            break;
        }
        --top;
    }
    return top;
}

function simulate(i, arr, timestep) {
    let part = i % 5;

    let top = getTop(arr);
    let posy = top + 3 + getPartHeight(part);
    for(let j = arr.length; j <= posy; ++j) {
        let next = new Array(7);
        next.fill(0);
        arr.push(next);
    }
    let posx = 2;

    while(true) {
        let dir = input[timestep % input.length];
        ++timestep;

        if(dir == '<' && canGoLeft(part, [posx, posy], arr)) {
            --posx;
        } else if(dir == '>' && canGoRight(part, [posx, posy], arr)) {
            ++posx;
        } else {
            if(dir != '<' && dir != '>') {
                throw new Error("bad direction")
            }
        }

        if(!canDrop(part, [posx, posy], arr)) {
            solidifyPart(part, [posx, posy], arr);
            break;
        } else {
            --posy;
        }
    }

    return timestep;
}

function part1() {
    let arr = [];
    let timestep = 0;
    
    for(let i = 0; i < 2022; ++i) {
        timestep = simulate(i, arr, timestep);
    }

    return getTop(arr) + 1;
}

function padArr(length, val, arr) {
    return Array(length - arr.length).fill(val).concat(arr);
}

function part2() {
    // Find a cycle

    const MAX_FALL = 64; // a quick experiment found that this was the longest a piece falls.
    let arr = [];
    let timestep = 0;
    let cycleStart = -1;
    let cyclePeriod = -1;
    let fillArr = new Array(7);
    fillArr.fill(1);
    let hashes = new Map();
    let heightAtPiece = new Map();
    
    for(let i = 0; i < 100000; ++i) {
        timestep = simulate(i, arr, timestep);
        let top = getTop(arr)+1;
        let topArr = padArr(MAX_FALL, fillArr, arr.slice(Math.max(0, top - MAX_FALL), top));
        let str = topArr.map(a=>a.join('')).join('');
        let hash = BigInt("0b" + str) * (BigInt(timestep % input.length)+1n);
        heightAtPiece.set(i, top);
        if(hashes.get(hash)) {
            cycleStart = hashes.get(hash);
            cyclePeriod = i - cycleStart;
            break;
        }
        hashes.set(hash, i);
    }

    if(cycleStart == -1 || cyclePeriod == -1) {
        throw new Error("Cycle not found");
    }

    let beforeCycleHeight = heightAtPiece.get(cycleStart-1);
    let cycleHeight = heightAtPiece.get(cycleStart+cyclePeriod-1) - beforeCycleHeight;
    let cycleIndex = (1000000000000 - cycleStart) % cyclePeriod;
    let cycleTailHeight = heightAtPiece.get(cycleStart + cycleIndex - 1) - heightAtPiece.get(cycleStart - 1);
    let cycleCount = (1000000000000 - cycleStart - cycleIndex) / cyclePeriod;

    return beforeCycleHeight + cycleCount * cycleHeight + cycleTailHeight;
}

const input = require("../input/2022/17.cjs")
console.log(part1());
console.log(part2());
