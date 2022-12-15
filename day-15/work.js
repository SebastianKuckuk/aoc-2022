const {range, anyOf, allOf, maxOf} = require("../util");

function parseInput(input) {
    const regex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
    return input.split('\n').map(row => row.match(regex).slice(1, 5).map(s => parseInt(s)))
}

module.exports = {
    part01: function part01(input) {
        const sensors = parseInput(input)
        const cantBe = new Set()

        const targetY = (2 === sensors[0][0]) ? 10 : 2_000_000

        for (const [sx, sy, bx, by] of sensors) {
            const maxDist = Math.abs(sx - bx) + Math.abs(sy - by)
            const dist = maxDist - Math.abs(sy - targetY)
            if (dist >= 0)
                for (let i of range(0, dist + 1)) {
                    cantBe.add(sx - i)
                    cantBe.add(sx + i)
                }
        }

        const beaconOnLine = new Set(sensors.filter(sensor => sensor[3] === targetY).map(sensor => sensor[2]))
        const cantBeWoBeacon = [...cantBe.values()].filter(x => !beaconOnLine.has(x))

        return cantBeWoBeacon.length
    },

    part02: function part02(input) {
        const sensors = parseInput(input).map(([sx, sy, bx, by]) =>
            [sx, sy, bx, by, Math.abs(sx - bx) + Math.abs(sy - by)])

        const [minX, maxX] = [0, (2 === sensors[0][0]) ? 20 : 4_000_000]
        const [minY, maxY] = [minX, maxX]

        for (let y = minY; y < maxY; ++y) {
            for (let x = minX; x < maxX; /*++x*/) {
                // pretty but too slow
                // const distAndMaxDist = sensors.map(([sx, sy, , , maxDist]) =>
                //     [Math.abs(sx - x) + Math.abs(sy - y), maxDist])
                //
                // if (allOf(distAndMaxDist.map(([dist, maxDist]) => dist > maxDist)))
                //     return x * 4000000 + y
                //
                // x += Math.max(1, maxOf(distAndMaxDist.map(([dist, maxDist]) => maxDist - dist)))

                // not so pretty but way faster
                let hit = true
                let maxNextStep = 1
                for (const [sx, sy, , , maxDist] of sensors) {
                    const dist = Math.abs(sx - x) + Math.abs(sy - y)
                    hit &&= (dist > maxDist)
                    maxNextStep = Math.max(maxNextStep, maxDist - dist)
                }

                if (hit)
                    return x * 4000000 + y

                x += maxNextStep
            }
        }
    }
}
