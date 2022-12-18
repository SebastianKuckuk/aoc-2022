const ndarray = require("ndarray")

const {range, maxOf, prodOf, sumOf} = require("../util");


function parseInput(input) {
    return input.split('\n').map(row => row.split(',').map(s => parseInt(s.toString())))
}

function setupGrid(voxels, defFill) {
    const lenPerDim = range(0, 3).map(i => maxOf(voxels.map(c => c[i])) + 2 + 1) // add halo
    const grid = ndarray(Array(prodOf(lenPerDim)).fill(defFill), lenPerDim)

    for (let voxel of voxels)
        grid.set(voxel[0] + 1, voxel[1] + 1, voxel[2] + 1, 1) // shift to halo

    return grid
}

function countSurface(grid) {
    return sumOf(
        (range(1, grid.shape[0] - 1).flatMap(x =>
            range(1, grid.shape[1] - 1).flatMap(y =>
                range(1, grid.shape[2] - 1).filter(z => (1 === grid.get(x, y, z))).map(z =>
                    (0 === grid.get(x - 1, y, z) ? 1 : 0)
                    + (0 === grid.get(x + 1, y, z) ? 1 : 0)
                    + (0 === grid.get(x, y - 1, z) ? 1 : 0)
                    + (0 === grid.get(x, y + 1, z) ? 1 : 0)
                    + (0 === grid.get(x, y, z - 1) ? 1 : 0)
                    + (0 === grid.get(x, y, z + 1) ? 1 : 0)
                )))))
}

module.exports = {
    part01: function part01(input) {
        let voxels = parseInput(input)
        const grid = setupGrid(voxels, 0)

        return countSurface(grid)
    },

    part02: function part02(input) {
        let voxels = parseInput(input)
        const grid = setupGrid(voxels, 2)

        function fill(x, y, z) { // recursive seed fill
            if (2 !== grid.get(x, y, z))
                return

            grid.set(x, y, z, 0)

            if (x > 0) fill(x - 1, y, z)
            if (y > 0) fill(x, y - 1, z)
            if (z > 0) fill(x, y, z - 1)
            if (x < grid.shape[0] - 1) fill(x + 1, y, z)
            if (y < grid.shape[1] - 1) fill(x, y + 1, z)
            if (z < grid.shape[2] - 1) fill(x, y, z + 1)
        }

        fill(0, 0, 0)

        return countSurface(grid)
    }
}
