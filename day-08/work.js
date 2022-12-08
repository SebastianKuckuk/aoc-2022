const {range, sumOf, allOf, maxOf, prodOf} = require("../util");

function parseInput(input) {
    return input.split('\n').map(row => row.split('').map(c => parseInt(c.toString())))
}

module.exports = {
    part01: function part01(input) {
        const grid = parseInput(input)
        const [nRow, nCol] = [grid.length, grid[0].length]

        return sumOf(
            range(0, nRow).flatMap(row =>
                range(0, nCol).map(col =>
                    (allOf(range(0, row).map(rowOff => grid[row][col] > grid[rowOff][col]))
                        || allOf(range(row + 1, nRow).map(rowOff => grid[row][col] > grid[rowOff][col]))
                        || allOf(range(0, col).map(colOff => grid[row][col] > grid[row][colOff]))
                        || allOf(range(col + 1, nCol).map(colOff => grid[row][col] > grid[row][colOff])))
                )
            )
        )
    },

    part02: function part02(input) {
        const grid = parseInput(input)
        const [nRow, nCol] = [grid.length, grid[0].length]

        function outlook(row, col, dir, step, maxStep) {
            if (step > maxStep)
                return 0

            if (grid[row + step * dir[0]][col + step * dir[1]] >= grid[row][col])
                return 1
            return 1 + outlook(row, col, dir, step + 1, maxStep)
        }

        return maxOf(
            range(1, nRow - 1).flatMap(row =>
                range(1, nCol - 1).map(col =>
                    prodOf([
                        outlook(row, col, [-1, 0], 1, row),
                        outlook(row, col, [1, 0], 1, nRow - 1 - row),
                        outlook(row, col, [0, -1], 1, col),
                        outlook(row, col, [0, 1], 1, nCol - 1 - col)
                    ])
                )))
    }
}
