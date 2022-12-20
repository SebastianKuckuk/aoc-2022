const {range, sumOf, minOf} = require("../util");

function parseInput(input) {
    return input.split('\n').map(row => parseInt(row.toString()))
}

function decryptCoords(initial, numMixSweeps) {
    let encrypted = initial.map((d, i) => `${i}:${d}`)

    for (let i of range(0, numMixSweeps))
        for (let [i, d] of initial.entries()) {
            const oldPos = encrypted.indexOf(`${i}:${d}`)
            const newPos = (oldPos + d) % (initial.length - 1)

            const elem = encrypted.splice(oldPos, 1)[0]
            encrypted.splice(newPos, 0, elem)
        }

    const targetIdx = encrypted.indexOf(`${initial.indexOf(0)}:0`)
    return sumOf(range(1, 4).map(i => parseInt(encrypted[(targetIdx + i * 1000) % encrypted.length].split(':')[1])))
}

module.exports = {
    part01: function part01(input) {
        const initial = parseInput(input)

        return decryptCoords(initial, 1)
    },

    part02: function part02(input) {
        const decryptKey = 811589153
        const initial = parseInput(input).map(d => d * decryptKey)

        return decryptCoords(initial, 10)
    }
}
