const {sumOf, prodOf, sumOfRange} = require("../util");

function parseInput(input) {
    const regex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
    return input.split('\n').map(row => row.match(regex).slice(1, 8).map(s => parseInt(s.toString())))
}

function simBlueprint(blueprint, maxTime) {
    const [_, orePerOre, orePerClay, orePerObs, clayPerObs, orePerGeode, obsPerGeode] = blueprint

    let maxGeode = 0

    function simMaxGeode(timeLeft, ore, clay, obs, geode, robOre, robClay, robObs, robGeode) {
        if (1 === timeLeft) { // time has run out
            maxGeode = Math.max(maxGeode, geode + robGeode * timeLeft)
            return
        }

        if (timeLeft <= maxTime / 2) { // check for early exit
            const limitAddRobOre = timeLeft - 1
            const limitOre = ore + robOre * timeLeft + sumOfRange(timeLeft - limitAddRobOre, timeLeft)

            const limitAddRobClay = Math.min(timeLeft - 1, Math.floor(limitOre / orePerClay))
            const limitClay = clay + robClay * timeLeft + sumOfRange(timeLeft - limitAddRobClay, timeLeft)

            const limitAddRobObs = Math.min(timeLeft - 1, Math.floor(limitClay / clayPerObs), Math.floor(limitOre / orePerObs))
            const limitObs = obs + robObs * timeLeft + sumOfRange(timeLeft - limitAddRobObs, timeLeft)

            const limitAddRobGeode = Math.min(timeLeft - 1, Math.floor(limitObs / obsPerGeode), Math.floor(limitOre / orePerGeode))
            const limitGeode = geode + robGeode * timeLeft + sumOfRange(timeLeft - limitAddRobGeode, timeLeft)

            if (limitGeode <= maxGeode)
                return
        }

        // check for buying new toys in order of importance ...
        if (ore >= orePerGeode && obs >= obsPerGeode) // check buying a geo dude
            simMaxGeode(timeLeft - 1, ore + robOre - orePerGeode, clay + robClay, obs + robObs - obsPerGeode, geode + robGeode,
                robOre, robClay, robObs, robGeode + 1)
        if (ore >= orePerObs && clay >= clayPerObs) // check buying an obsidian robot
            simMaxGeode(timeLeft - 1, ore + robOre - orePerObs, clay + robClay - clayPerObs, obs + robObs, geode + robGeode,
                robOre, robClay, robObs + 1, robGeode)
        if (ore >= orePerClay) // check buying a clay machine
            simMaxGeode(timeLeft - 1, ore + robOre - orePerClay, clay + robClay, obs + robObs, geode + robGeode,
                robOre, robClay + 1, robObs, robGeode)
        if (ore >= orePerOre) // check buying an ore producer
            simMaxGeode(timeLeft - 1, ore + robOre - orePerOre, clay + robClay, obs + robObs, geode + robGeode,
                robOre + 1, robClay, robObs, robGeode)

        // ... or do nothing at all
        simMaxGeode(timeLeft - 1, ore + robOre, clay + robClay, obs + robObs, geode + robGeode,
            robOre, robClay, robObs, robGeode)
    }

    simMaxGeode(maxTime, 0, 0, 0, 0, 1, 0, 0, 0)

    return maxGeode
}

module.exports = {
    part01: function part01(input) {
        const blueprints = parseInput(input)

        return sumOf(blueprints.map(blueprint => blueprint[0] * simBlueprint(blueprint, 24)))
    },

    part02: function part02(input) {
        const blueprints = parseInput(input)

        return prodOf(blueprints.slice(0, Math.min(3, blueprints.length)).map(blueprint =>
            simBlueprint(blueprint, 32)))
    }
}
