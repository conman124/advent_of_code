export default function average(acc, val, index, arr) {
    return acc + (val / arr.length);
}

average.identity = 0;
