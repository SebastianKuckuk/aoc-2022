const {range} = require("../util");

function parseInput(input) {
    const dirMap = new Map([['R', [1, 0]], ['L', [-1, 0]], ['U', [0, 1]], ['D', [0, -1]]])

    return input.split('\n').map(row => {
        let [dirChar, steps] = row.split(' ')
        steps = parseInt(steps)
        return [dirMap.get(dirChar), steps]
    })
}

function makeMoves(numNodes, moves) {
    let [x, y] = [Array(numNodes).fill(0), Array(numNodes).fill(0)]
    const visited = new Set()

    for (const [[dx, dy], steps] of moves) {
        for (let step of range(0, steps)) {
            x[0] += dx
            y[0] += dy

            for (let node of range(1, numNodes)) {
                if (Math.abs(x[node - 1] - x[node]) > 1 || Math.abs(y[node - 1] - y[node]) > 1) {
                    y[node] += Math.sign(y[node - 1] - y[node])
                    x[node] += Math.sign(x[node - 1] - x[node])
                }
            }

            // visited.add([x[numNodes-1],y[numNodes-1]]) // won't work because Arrays are not compared deeply -.-
            visited.add(`${x[numNodes - 1]}---${y[numNodes - 1]}`)
        }
    }

    return visited.size
}

module.exports = {
    part01: function part01(input) {
        return makeMoves(2, parseInput(input))
    },

    part02: function part02(input) {
        return makeMoves(10, parseInput(input))
    }
}
