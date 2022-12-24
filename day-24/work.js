const dirVec = [[0, 1], [1, 0], [0, -1], [-1, 0]]
const dirMap = {'>': [0, 1], 'v': [1, 0], '<': [0, -1], '^': [-1, 0]}

function parseInput(input) {
    const rows = input.split('\n')

    const [numRows, numCols] = [rows.length, rows[0].length]

    const blizzards = []
    for (let [rowIdx, row] of rows.entries()) {
        for (let [colIdx, c] of [...row].entries()) {
            if ('#' === c || '.' === c)
                continue
            blizzards.push({pos: [rowIdx, colIdx], nextPos: [rowIdx, colIdx], dir: dirMap[c]})
        }
    }

    const start = rows.shift().indexOf('.')
    const end = rows.pop().indexOf('.')

    return [numRows, numCols, [0, start], [numRows - 1, end], blizzards]
}

function simulate(numRows, numCols, start, finish, blizzards) {
    let positions = [start]
    let nextPositions = []

    function posIsValid(row, col) {
        if (col < 1 || col >= numCols - 1)
            return false
        if (row < 1 && ((0 === start[0] && col !== start[1]) || (0 === finish[0] && col !== finish[1])))
            return false
        if (row >= numRows - 1 && ((numRows - 1 === start[0] && col !== start[1]) || (numRows - 1 === finish[0] && col !== finish[1])))
            return false

        return 0 === blizzards.filter(b => b.nextPos[0] === row && b.nextPos[1] === col).length
    }

    let steps = 0
    for (; ; steps++) {
        // set next positions of blizzards
        for (let b of blizzards) {
            b.nextPos[0] = (b.pos[0] + b.dir[0] - 1 + numRows - 2) % (numRows - 2) + 1
            b.nextPos[1] = (b.pos[1] + b.dir[1] - 1 + numCols - 2) % (numCols - 2) + 1
        }

        // set next possible positions
        for (let pos of positions) {
            if (posIsValid(...pos)) // stay ...
                nextPositions.push(pos)

            for (let dir of dirVec) // ... or go
                if (posIsValid(pos[0] + dir[0], pos[1] + dir[1]))
                    nextPositions.push([pos[0] + dir[0], pos[1] + dir[1]])
        }

        // move blizzards
        for (let b of blizzards) {
            b.pos[0] = b.nextPos[0]
            b.pos[1] = b.nextPos[1]
        }

        // hack for array.unique if type of elements is also array
        nextPositions = [...(new Set(nextPositions.map(p => p.join('|'))))].map(p => p.split('|').map(c => Number(c)))

        positions = nextPositions
        nextPositions = []

        if (positions.filter(p => p[0] === finish[0] && p[1] === finish[1]).length > 0)
            break

        if (steps >= 999) {
            console.log('This is taking too long...')
            break
        }
    }

    return steps + 1
}

module.exports = {
    part01: function part01(input) {
        const [numRows, numCols, start, finish, blizzards] = parseInput(input)

        return simulate(numRows, numCols, start, finish, blizzards)
    },

    part02: function part02(input) {
        const [numRows, numCols, start, finish, blizzards] = parseInput(input)

        const time_01 = simulate(numRows, numCols, start, finish, blizzards)
        const time_02 = simulate(numRows, numCols, finish, start, blizzards)
        const time_03 = simulate(numRows, numCols, start, finish, blizzards)

        return time_01 + time_02 + time_03
    }
}
