const {minOf, maxOf, range} = require("../util");

function parseInput(input) {
    return input.split('\n').map(row => row.split(' -> ').map(pair => pair.split(',').map(pos => parseInt(pos.toString()))))
}

module.exports = {
    part01: function part01(input) {
        const lines = parseInput(input)

        const start = [500, 0]

        const minX = minOf(lines.flatMap(line => line.flatMap(pair => pair[0])).concat([start[0]]))
        const maxX = maxOf(lines.flatMap(line => line.flatMap(pair => pair[0])).concat([start[0]]))
        const minY = minOf(lines.flatMap(line => line.flatMap(pair => pair[1])).concat([start[1]]))
        const maxY = maxOf(lines.flatMap(line => line.flatMap(pair => pair[1])).concat([start[1]]))

        const numX = maxX - minX + 1
        const numY = maxY - minY + 1

        const grid = Array(numY).fill(0).map(_ => Array(numX).fill('.'))

        for (const line of lines)
            for (const i of range(0, line.length - 1))
                for (const x of range(Math.min(line[i][0], line[i + 1][0]), Math.max(line[i][0], line[i + 1][0]) + 1))
                    for (const y of range(Math.min(line[i][1], line[i + 1][1]), Math.max(line[i][1], line[i + 1][1]) + 1))
                        grid[y - minY][x - minX] = '#'

        let voidReached = false
        let numSandResting = 0
        while (!voidReached) {
            let sand = [start[0] - minX, start[1] - minY] // new sand
            let atRest = false
            while (!atRest) {
                if (numY - 1 === sand[1]) {
                    voidReached = true
                    break
                } else if ('.' === grid[sand[1] + 1][sand[0]]) {
                    ++sand[1]
                } else if (0 === sand[0]) {
                    voidReached = true
                    break
                } else if ('.' === grid[sand[1] + 1][sand[0] - 1]) {
                    --sand[0]
                    ++sand[1]
                } else if (numX - 1 === sand[0]) {
                    voidReached = true
                    break
                } else if ('.' === grid[sand[1] + 1][sand[0] + 1]) {
                    ++sand[0]
                    ++sand[1]
                } else {
                    grid[sand[1]][sand[0]] = 'o'
                    atRest = true
                }
            }

            if (atRest)
                ++numSandResting

            // console.log(grid.map(row => row.join('')).join('\n'))
        }

        return numSandResting
    },

    part02: function part02(input) {
        const lines = parseInput(input)

        const start = [500, 0]

        let minX = minOf(lines.flatMap(line => line.flatMap(pair => pair[0])).concat([start[0]]))
        let maxX = maxOf(lines.flatMap(line => line.flatMap(pair => pair[0])).concat([start[0]]))
        let minY = minOf(lines.flatMap(line => line.flatMap(pair => pair[1])).concat([start[1]]))
        let maxY = maxOf(lines.flatMap(line => line.flatMap(pair => pair[1])).concat([start[1]]))

        maxY += 2
        minX = Math.min(minX, start[0] - (maxY - minY))
        maxX = Math.max(maxX, start[0] + (maxY - minY))

        const numX = maxX - minX + 1
        const numY = maxY - minY + 1

        const grid = Array(numY).fill(0).map(_ => Array(numX).fill('.'))

        for (const line of lines)
            for (const i of range(0, line.length - 1))
                for (const x of range(Math.min(line[i][0], line[i + 1][0]), Math.max(line[i][0], line[i + 1][0]) + 1))
                    for (const y of range(Math.min(line[i][1], line[i + 1][1]), Math.max(line[i][1], line[i + 1][1]) + 1))
                        grid[y - minY][x - minX] = '#'

        for (let x in range(0, numX + 1))
            grid[numY - 1][x] = '#'

        let startReached = false
        let numSandResting = 0
        while (!startReached) {
            let sand = [start[0] - minX, start[1] - minY] // new sand
            let atRest = false
            while (!atRest) {
                if ('.' === grid[sand[1] + 1][sand[0]]) {
                    ++sand[1]
                } else if ('.' === grid[sand[1] + 1][sand[0] - 1]) {
                    --sand[0]
                    ++sand[1]
                } else if ('.' === grid[sand[1] + 1][sand[0] + 1]) {
                    ++sand[0]
                    ++sand[1]
                } else {
                    grid[sand[1]][sand[0]] = 'o'
                    atRest = true
                }

                if (atRest && sand[0] === start[0] - minX && sand[1] === start[1] - minY)
                    startReached = true
            }

            if (atRest)
                ++numSandResting

            // console.log(grid.map(row => row.join('')).join('\n'))
        }

        return numSandResting
    }
}
