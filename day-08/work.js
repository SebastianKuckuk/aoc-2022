const {range, sumOf, allOf, maxOf} = require("../util");

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

        return maxOf(
            range(1, nRow - 1).flatMap(row =>
                range(1, nCol - 1).map(col => {
                    let score = 1

                    let localScore = 0
                    for (let rowOff = row - 1; rowOff >= 0; --rowOff) {
                        ++localScore
                        if (grid[rowOff][col] >= grid[row][col])
                            break
                    }
                    score *= localScore

                    localScore = 0
                    for (let rowOff = row + 1; rowOff < nRow; ++rowOff) {
                        ++localScore
                        if (grid[rowOff][col] >= grid[row][col])
                            break
                    }
                    score *= localScore

                    localScore = 0
                    for (let colOff = col - 1; colOff >= 0; --colOff) {
                        ++localScore
                        if (grid[row][colOff] >= grid[row][col])
                            break
                    }
                    score *= localScore

                    localScore = 0
                    for (let colOff = col + 1; colOff < nCol; ++colOff) {
                        ++localScore
                        if (grid[row][colOff] >= grid[row][col])
                            break
                    }
                    score *= localScore

                    return score
                })))
    }
}
