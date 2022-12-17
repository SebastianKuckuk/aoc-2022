const {maxOf, range, allOf} = require("../util");

function parseInput(input) {
    return input.split('').map(c => '>' === c ? 1 : -1)
}

const shapes = [ // in offset notation
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [0, 1], [1, 1]]
]

function isValidPosition(grid, x, y) {
    return (x >= 0 && x < grid.length
        && (grid[x].length <= y || '.' === grid[x][y]))
}

function dropOneRock(grid, moves, rockI, pushI) {
    let [x, y] = [2, 3 + maxOf([0].concat(grid.map(stack => stack.length)))]
    const shape = shapes[rockI % shapes.length]

    while (true) {
        // push to side
        const move = moves[pushI]
        pushI = (pushI + 1) % moves.length

        if (allOf(shape.map(([xOff, yOff]) => isValidPosition(grid, x + xOff + move, y + yOff))))
            x += move

        // fall downwards
        if (allOf(shape.map(([xOff, yOff]) => isValidPosition(grid, x + xOff, y + yOff - 1))))
            y -= 1
        else // hit something
            break
    }

    // draw rock
    for (const [xOff, yOff] of shape) {
        while (grid[x + xOff].length <= y + yOff)
            grid[x + xOff].push('.')
        grid[x + xOff][y + yOff] = '#'
    }

    // debug output
    // console.log(grid.map(stack => stack.join('')).join('\n'))

    return pushI
}

module.exports = {
    part01: function part01(input) {
        const moves = parseInput(input)
        const grid = Array(7).fill(0).map(_ => [])

        let pushI = 0
        for (let rockI of range(0, 2022))
            pushI = dropOneRock(grid, moves, rockI, pushI)

        return maxOf(grid.map(stack => stack.length))
    },

    part02: function part02(input) {
        const moves = parseInput(input)
        const grid = Array(7).fill(0).map(_ => [])

        let rockI = 0
        let pushI = 0

        function playTetris(numRocks) {
            const rockBegin = rockI
            while (rockI < rockBegin + numRocks) {
                pushI = dropOneRock(grid, moves, rockI, pushI)
                rockI += 1
            }
        }

        // warm-up
        const warmUpSize = moves.length
        playTetris(warmUpSize)
        const targetPushI = pushI
        const heightWarmUp = maxOf(grid.map(stack => stack.length))

        // loop
        do {
            playTetris(shapes.length)
        } while (pushI !== targetPushI)

        const loopSize = rockI - warmUpSize
        const heightLoop = maxOf(grid.map(stack => stack.length)) - heightWarmUp
        const numLoops = Math.floor((1_000_000_000_000 - warmUpSize) / loopSize)

        // remainder
        playTetris(1_000_000_000_000 - warmUpSize - numLoops * loopSize)
        const heightRemainder = maxOf(grid.map(stack => stack.length)) - heightWarmUp - heightLoop

        return heightWarmUp + numLoops * heightLoop + heightRemainder
    }
}
