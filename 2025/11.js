import tee from "../tee.cjs";
import sum from "../sum.cjs";
import memoize from "../memoize.js"; 
import input from "../input/2025/11.js";

function solve1() {
    const graph = input.split("\n").map(line => {
        const [name, ...rest] = line.split(" ");
        return {name: name.slice(0,-1), outputs: rest}
    }).reduce((acc, {name, outputs}) => ({...acc, [name]: outputs}), {});

    // assume there are no cycles
    function dfs(node) {
        if(node === "out") {
            return 1;
        }

        return graph[node].map(dfs).reduce(sum, 0);
    }

    return dfs("you");
}

function solve2() {

    const graph = input.split("\n").map(line => {
        const [name, ...rest] = line.split(" ");
        return {name: name.slice(0,-1), outputs: rest}
    }).reduce((acc, {name, outputs}) => ({...acc, [name]: outputs}), {});

    function dfsUnmemo(node, target) {
        if(node === target) {
            return 1;
        }

        return (graph[node] || []).map(a => dfs(a, target)).reduce(sum, 0);
    }

    const dfs = memoize(dfsUnmemo);

    return dfs("svr", "fft") * dfs("fft", "dac") * dfs("dac", "out") + dfs("svr", "dac") * dfs("dac", "fft") * dfs("fft", "out");
}

console.log(solve1());
console.log(solve2());
