const {minOf, maxOf, range, allOf} = require("../util");

function parseInput(input) {
    let elves = []

    const rows = input.split('\n')
    for (let [rowIdx, row] of rows.entries())
        for (let [colIdx, c] of [...row].entries())
            if ('#' === c)
                elves.push({x: colIdx, y: (rows.length - 1) - rowIdx})

    return elves
}

const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
]

let dirsToMove = []

function resetDirsToMove() {
    dirsToMove = [
        [[0, 1], [1, 1], [-1, 1]],
        [[0, -1], [1, -1], [-1, -1]],
        [[-1, 0], [-1, 1], [-1, -1]],
        [[1, 0], [1, 1], [1, -1]]
    ]
}

function simulate(elves, numRounds) {
    function elfAt(x, y) {
        for (let elf of elves)
            if (elf.x === x && elf.y === y)
                return true
        return false
    }

    for (let round of range(0, numRounds)) {
        for (let elf of elves) {
            elf.nextX = elf.x
            elf.nextY = elf.y

            // check if ready to move
            if (allOf(neighbors.map(([dx, dy]) => !elfAt(elf.x + dx, elf.y + dy))))
                continue

            for (let dir of dirsToMove)
                if (allOf(dir.map(([dx, dy]) => !elfAt(elf.x + dx, elf.y + dy)))) {
                    elf.nextX = elf.x + dir[0][0]
                    elf.nextY = elf.y + dir[0][1]
                    break
                }
        }

        for (let elf of elves) {
            elf.moved = false
            if (elves.filter(e => e.nextX === elf.nextX && e.nextY === elf.nextY).length <= 1) {
                if (elf.x !== elf.nextX || elf.y !== elf.nextY)
                    elf.moved = true
                elf.x = elf.nextX
                elf.y = elf.nextY
            }
        }

        dirsToMove.push(dirsToMove.shift())
    }
}

module.exports = {
    part01: function part01(input) {
        const elves = parseInput(input)

        resetDirsToMove()
        simulate(elves, 10)

        return ((maxOf(elves.map(e => e.x)) - minOf(elves.map(e => e.x)) + 1)
            * (maxOf(elves.map(e => e.y)) - minOf(elves.map(e => e.y)) + 1)
            - elves.length)
    },

    part02: function part02(input) {
        const elves = parseInput(input)

        resetDirsToMove()

        let rounds = 0
        do {
            simulate(elves, 1)
            rounds++
            // console.log(`${rounds} : ${elves.filter(e => e.moved).length}`)
        } while (0 !== elves.filter(e => e.moved).length)

        return rounds
    }
}
