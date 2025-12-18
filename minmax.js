export function min(acc, a) {
    return Math.min(acc, a);
}

min.identity = Number.POSITIVE_INFINITY;

export function max(acc, a) {
    return Math.max(acc, a);
}

max.identity = Number.NEGATIVE_INFINITY;
