const {sumOf, range} = require("../util");

function parseInput(input) {
    return input.split('\n')
}

function simulateX(ops) {
    let x = [1]

    for (const op of ops) {
        if ('noop' === op) {
            x.push(x[x.length - 1])
        } else { // 'add'
            const y = parseInt(op.split(' ')[1])
            x.push(x[x.length - 1])
            x.push(x[x.length - 1] + y)
        }
    }

    return x
}

module.exports = {
    part01: function part01(input) {
        const positions = simulateX(parseInput(input))
        return sumOf([20, 60, 100, 140, 180, 220].map(i => i * positions[i - 1]))
    },

    part02: function part02(input) {
        const positions = simulateX(parseInput(input))

        let screen = Array(6).fill('')
        for (const i in range(0, 240)) {
            const [x, y] = [i % 40, Math.floor(i / 40)]
            screen[y] += (Math.abs(x - positions[i]) <= 1) ? '#' : '.'
        }

        return '\n' + screen.join('\n')
    }
}
