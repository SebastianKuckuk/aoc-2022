const {range, sumOf} = require("../util");

function parseInput(input) {
    const regex = /Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$///(?:([A-Z]+), )*([A-Z]+)/
    let parsed = input.split('\n').map(row => row.match(regex)).map(m =>
        [m[1], parseInt(m[2]), m[3].replaceAll(' ', '').split(',')])

    // prioritize high-flow parts
    parsed = parsed.sort((a, b) => -(a[1] - b[1]))

    let nodes = parsed.map(m => m[0])
    let flows = parsed.map(m => m[1])
    let paths = parsed.map(m => m[2])
    let distMatrix = nodes.map(node => shortestPath(nodes, paths, node))

    // filter no-flows
    const startIdx = nodes.indexOf('AA')

    function filterCond(n, i) {
        return startIdx === i || flows[i] > 0
    }

    distMatrix = distMatrix.map(row => row.filter(filterCond)).filter(filterCond)
    nodes = nodes.filter(filterCond)
    flows = flows.filter(filterCond)

    return [nodes, flows, distMatrix]
}

function shortestPath(nodes, paths, start) {
    let distances = nodes.map(_ => 1e30)
    let queue = [...nodes.keys()]

    distances[nodes.indexOf(start)] = 0

    while (queue.length > 0) {
        const curNodeIdx = queue.sort((a, b) => -(distances[a] - distances[b])).pop()

        let possibleDir = paths[curNodeIdx].map(dir => nodes.indexOf(dir))
        // console.log(possibleDir)

        for (let dir of possibleDir)
            if (distances[curNodeIdx] + 1 < distances[dir])
                distances[dir] = distances[curNodeIdx] + 1
    }

    return distances
}


module.exports = {
    part01: function part01(input) {
        const [nodes, flows, distMatrix] = parseInput(input)
        const theoreticalFlowLimit = sumOf(flows)

        let opened = nodes.map(_ => false)
        let overallMaxFlow = 0

        function trace(timeLeft, curPos, curFlow, accFlow) {
            if (timeLeft <= 1 || accFlow + theoreticalFlowLimit * timeLeft <= overallMaxFlow) {
                overallMaxFlow = Math.max(overallMaxFlow, accFlow + curFlow * timeLeft)
                return
            }

            if (!opened[curPos] && flows[curPos] > 0) {
                opened[curPos] = true
                trace(timeLeft - 1, curPos, curFlow + flows[curPos], accFlow + curFlow)
                opened[curPos] = false
            }

            for (let i in distMatrix) {
                const distToNext = distMatrix[curPos][i]
                if (curPos !== i && !opened[i] && timeLeft > distToNext + 1)
                    trace(timeLeft - distToNext, i, curFlow, accFlow + curFlow * distToNext)
            }

            overallMaxFlow = Math.max(overallMaxFlow, accFlow + timeLeft * curFlow)
        }

        trace(30, nodes.indexOf('AA'), 0, 0)
        return overallMaxFlow
    },

    part02: function part02(input) {
        const [nodes, flows, distMatrix] = parseInput(input)
        const theoreticalFlowLimit = sumOf(flows)

        let opened = distMatrix.map(_ => false)
        let overallMaxFlow = 0

        const indices = range(0, distMatrix.length)

        function trace(timeLeft, curPos, movesLeft, curFlow, accFlow) {
            if (timeLeft <= 1 || accFlow + theoreticalFlowLimit * timeLeft <= overallMaxFlow) {
                overallMaxFlow = Math.max(overallMaxFlow, accFlow + curFlow * timeLeft)
                return
            }

            if (0 === movesLeft[0]) {
                for (let i of indices) {
                    const distToNext = distMatrix[curPos[0]][i]
                    if (curPos[0] !== i && !opened[i] && timeLeft > distToNext + 1) {
                        opened[i] = true
                        // apply correction to accFlow for overcompensation with already increased curFlow
                        trace(timeLeft, [i, curPos[1]], [distToNext + 1, movesLeft[1]],
                            curFlow + flows[i], accFlow - (distToNext + 1) * flows[i])
                        opened[i] = false
                    }
                }
            }
            if (0 === movesLeft[1]) {
                for (let i of indices) {
                    const distToNext = distMatrix[curPos[1]][i]
                    if (curPos[1] !== i && !opened[i] && timeLeft > distToNext + 1) {
                        opened[i] = true
                        // apply correction to accFlow for overcompensation with already increased curFlow
                        trace(timeLeft, [curPos[0], i], [movesLeft[0], distToNext + 1],
                            curFlow + flows[i], accFlow - (distToNext + 1) * flows[i])
                        opened[i] = false
                    }
                }
            }

            const skipAhead = Math.min(movesLeft[0], movesLeft[1])
            if (skipAhead > 0)
                trace(timeLeft - skipAhead, curPos, [movesLeft[0] - skipAhead, movesLeft[1] - skipAhead],
                    curFlow, accFlow + curFlow * skipAhead)

            overallMaxFlow = Math.max(overallMaxFlow, accFlow + timeLeft * curFlow)
        }

        trace(26, [nodes.indexOf('AA'), nodes.indexOf('AA')], [0, 0],
            0, 0)
        return overallMaxFlow
    }
}
