import numericSort from "../numeric_sort.js";
import input from "../input/2025/09.js";

function solve1() {
    const coords = input.split("\n").map(a => a.split(",").map(Number));

    let max = 0;

    for(let i = 0; i < coords.length; ++i) {
        for(let j = i+1; j < coords.length; ++j) {
            const w = Math.abs(coords[i][0] - coords[j][0]) + 1;
            const h = Math.abs(coords[i][1] - coords[j][1]) + 1;
            max = Math.max(max, w*h);
        }
    }
    return max;
}

function solve2() {
    const origCoords = input.split("\n").map(a => a.split(",").map(Number));
    const hLines = new Map();
    const vLines = new Map();

    const bigToSmallXCoords = {};
    const smallToBigXCoords = {};
    const bigToSmallYCoords = {};
    const smallToBigYCoords = {};

    const bigXCoords = origCoords.map(a => a[0]).sort(numericSort).filter((a,i,o) => i == 0 || o[i-1] !== a);
    const bigYCoords = origCoords.map(a => a[1]).sort(numericSort).filter((a,i,o) => i == 0 || o[i-1] !== a)

    for(let i = 0; i < bigXCoords.length; ++i) {
        bigToSmallXCoords[bigXCoords[i]] = i*2 + 1;
        smallToBigXCoords[i*2 + 1] = bigXCoords[i];
    }
    for(let i = 0; i < bigYCoords.length; ++i) {
        bigToSmallYCoords[bigYCoords[i]] = i*2 + 1;
        smallToBigYCoords[i*2 + 1] = bigYCoords[i];
    }
    
    const coords = origCoords.map(([x, y]) => [bigToSmallXCoords[x], bigToSmallYCoords[y]]);

    function addLine(xBegin, yBegin, xEnd, yEnd) {
        if(xBegin == xEnd) {
            const t = Math.min(yBegin, yEnd);
            const b = Math.max(yBegin, yEnd);
            const lines = vLines.get(xBegin) || [];
            lines.push([t,b]);
            vLines.set(xBegin, lines);
        } else if (yBegin == yEnd) {
            const l = Math.min(xBegin, xEnd);
            const r = Math.max(xBegin, xEnd);
            const lines = hLines.get(yBegin) || [];
            lines.push([l,r]);
            hLines.set(yBegin, lines);
        } else {
            throw new Error("Line is not h or v");
        }
    }

    for(let i = 1; i < coords.length; ++i) {
        addLine(coords[i][0], coords[i][1], coords[i-1][0], coords[i-1][1]);
    }
    addLine(coords[0][0], coords[0][1], coords[coords.length-1][0], coords[coords.length-1][1]);

    function raycastLeft(x, y) {
        let intersections = 0;
        for(; x >= 0; --x) {
            const lines = vLines.get(x) || [];
            lines.forEach(([t, b]) => {
                if(y >= t && y <= b) {
                    ++intersections;
                }
            });
        }
        return intersections;
    }

    function raycastUp(x, y) {
        let intersections = 0;
        for(; y >= 0; --y) {
            const lines = hLines.get(y) || [];
            lines.forEach(([l, r]) => {
                if(x >= l && x <= r) {
                    ++intersections;
                }
            });
        }
        return intersections;

    }

    let max = 0;

    for(let i = 0; i < coords.length; ++i) {
        for(let j = i+1; j < coords.length; ++j) {
            // Assuming that it won't be a single line:
            if(coords[i][0] == coords[j][0] || coords[i][1] == coords[j][1]) {
                continue;
            }
            const w = Math.abs(smallToBigXCoords[coords[i][0]] - smallToBigXCoords[coords[j][0]]) + 1;
            const h = Math.abs(smallToBigYCoords[coords[i][1]] - smallToBigYCoords[coords[j][1]]) + 1;
            if(w*h > max) {
                const xL = Math.min(coords[i][0], coords[j][0]);
                const xR = Math.max(coords[i][0], coords[j][0]);
                const yT = Math.min(coords[i][1], coords[j][1]);
                const yB = Math.max(coords[i][1], coords[j][1]);

                // Check if it is valid
                const hTL = raycastLeft(xL+1, yT+1);
                if(hTL % 2 !== 1) continue;
                const hTR = raycastLeft(xR-1, yT+1);
                if(hTR % 2 !== 1) continue;
                if(hTL !== hTR) continue;
                const hBL = raycastLeft(xL+1, yB-1);
                if(hBL % 2 !== 1) continue;
                const hBR = raycastLeft(xR-1, yB-1);
                if(hBR % 2 !== 1) continue;
                if(hBL !== hBR) continue;

                const vTL = raycastUp(xL+1, yT+1);
                if(vTL % 2 !== 1) continue;
                const vBL = raycastUp(xL+1, yB-1);
                if(vBL % 2 !== 1) continue;
                if(vTL !== vBL) continue;
                const vTR = raycastUp(xR-1, yT+1);
                if(vTR % 2 !== 1) continue;
                const vBR = raycastUp(xR-1, yB-1);
                if(vBR % 2 !== 1) continue;
                if(vTR !== vBR) continue;

                max = w*h;
            }
        }
    }
    return max;
}

console.log(solve1());
console.log(solve2());
