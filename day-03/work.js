const {sumOf, range, intersection} = require("../util");

const NUM_ELVES_PER_GROUP = 3

function mapToInt(s) {
    return [...s].map(c => {
        if (c === c.toLowerCase())
            return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1
        else
            return c.charCodeAt(0) - 'A'.charCodeAt(0) + 27
    })
}

function parseInputPart01(input) {
    return input.split('\n').map(row => [
        mapToInt(row.substring(0, row.length / 2)),
        mapToInt(row.substring(row.length / 2))])
}

function parseInputPart02(input) {
    const rows = input.split('\n')
    return range(0, rows.length, NUM_ELVES_PER_GROUP).map(i =>
        range(0, NUM_ELVES_PER_GROUP).map(offset => mapToInt(rows[i + offset])))
}

module.exports = {
    part01: function part01(input) {
        const rucksacks = parseInputPart01(input)
        const duplicates = rucksacks.map(compartments => sumOf(intersection(compartments)))
        return sumOf(duplicates)
    },

    part02: function part02(input) {
        const groups = parseInputPart02(input)
        const badges = groups.map(group => sumOf(intersection(group)))
        return sumOf(badges)
    }
}
