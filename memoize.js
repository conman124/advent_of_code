export default function memoize(fn) {
    // This assumes arguments to functions can be reliably stringified
    // and that the string representations do not include underscores.
    // If that is not true, we will need to make a more sophisticated
    // version
    const saved = new Map();
    return function memoized() {
        const tag = Array.from(arguments).join("__");
        if(saved.has(tag)) {
            return saved.get(tag);
        }
        const ret = fn(...arguments);
        saved.set(tag, ret);
        return ret;
    }
}
