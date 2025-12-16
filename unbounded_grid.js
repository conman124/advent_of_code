export default function unboundedGrid(grid, row, col, def) {
    if(typeof def !== "function") {
        const ogDef = def;
        def = () => ogDef;
    }

    if(row < 0 || row >= grid.length) {
        return def(row, col);
    } else if(col < 0 || col >= grid[0].length) {
        return def(row, col);
    } else {
        return grid[row][col];
    }
}
