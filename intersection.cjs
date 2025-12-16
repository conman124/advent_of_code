/**
 * @param {Set} a
 * @param {Set} b
 */
module.exports = function intersection(a,b) {
    const ret = new Set();
    for(const val of a) {
        if(b.has(val)) {
            ret.add(val);
        }
    }
    return ret;
}