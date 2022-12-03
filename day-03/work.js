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
    return [...Array(rows.length).keys()].filter(i => 0 === i % 3).map(i =>
        [...Array(3).keys()].map(offset => new Set(mapToInt(rows[i + offset]))))
}

module.exports = {
    part01: function part01(input) {
        const rucksacks = parseInputPart01(input)
        const duplicates = rucksacks.map(([left, right]) => [...(new Set(left.filter(e => right.includes(e))))].reduce((a, b) => a + b, 0))
        return duplicates.reduce((a, b) => a + b, 0)
    },

    part02: function part02(input) {
        const groups = parseInputPart02(input)
        const badges = groups.map(group =>
            Array.from(group[0]).filter(e => group[1].has(e) && group[2].has(e)).reduce((a, b) => a + b, 0))
        return badges.reduce((a, b) => a + b, 0)
    }
}
