const {range, minOf} = require("../util");

function parseInput(input) {
    const grid = input.split('\n').map(row => row.split('').map(c => (c === c.toLowerCase()) ? c.charCodeAt(0) - 'a'.charCodeAt(0) : c))

    const nCol = grid[0].length
    const [sRow, sCol] = [Math.floor(input.indexOf('S') / (nCol + 1)), input.indexOf('S') % (nCol + 1)]
    const [eRow, eCol] = [Math.floor(input.indexOf('E') / (nCol + 1)), input.indexOf('E') % (nCol + 1)]

    grid[eRow][eCol] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0)
    grid[sRow][sCol] = 0

    return [grid, [sRow, sCol], [eRow, eCol]]
}

function shortestPath(grid, sRow, sCol, eRow, eCol) {
    let distances = grid.map(row => row.map(_ => 1e30))
    let queue = range(0, grid.length).flatMap(row => range(0, grid[0].length).map(col => [row, col]))

    distances[eRow][eCol] = 0

    while (queue.length > 0) {
        const [row, col] = queue.sort(([a, b], [x, y]) => -(distances[a][b] - distances[x][y])).pop()

        let possibleDir = []

        if (row > 0) possibleDir.push([-1, 0])
        if (row < grid.length - 1) possibleDir.push([1, 0])
        if (col > 0) possibleDir.push([0, -1])
        if (col < grid[0].length - 1) possibleDir.push([0, 1])

        // filter invalid moves
        possibleDir = possibleDir.filter(dir => grid[row + dir[0]][col + dir[1]] + 1 >= grid[row][col])

        // filter already visited positions
        possibleDir = possibleDir.filter(dir => queue.find(pos => pos[0] === row + dir[0] && pos[1] === col + dir[1]) !== undefined)

        // filter targets with already known shorter paths
        possibleDir = possibleDir.filter(dir => distances[row][col] + 1 < distances[row + dir[0]][col + dir[1]])

        for (let dir of possibleDir)
            distances[row + dir[0]][col + dir[1]] = distances[row][col] + 1
    }

    return distances
}

module.exports = {
    part01: function part01(input) {
        const [grid, [sRow, sCol], [eRow, eCol]] = parseInput(input)

        return shortestPath(grid, sRow, sCol, eRow, eCol)[sRow][sCol]
    },

    part02: function part02(input) {
        const [grid, [sRow, sCol], [eRow, eCol]] = parseInput(input)

        let possibleStarts = range(0, grid.length).flatMap(row => range(0, grid[0].length).map(col => [row, col]))
        possibleStarts = possibleStarts.filter(([row, col]) => 0 === grid[row][col])

        const distances = shortestPath(grid, sRow, sCol, eRow, eCol)
        return minOf(possibleStarts.map(([sRow, sCol]) => distances[sRow][sCol]))
    }
}
