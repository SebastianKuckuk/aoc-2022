const {range, sumOf, prodOf} = require("../util");

function parseInput(input) {
    return input.split('\n\n').map(pair => pair.split('\n').map(eval))
}

function cmp(a, b) {
    if (!Array.isArray(a) && !Array.isArray(b))
        return a - b
    if (!Array.isArray(a) && Array.isArray(b))
        return cmp([a], b)
    if (Array.isArray(a) && !Array.isArray(b))
        return cmp(a, [b])

    // compare array elements
    for (let i in range(0, Math.min(a.length, b.length))) {
        const res = cmp(a[i], b[i])
        if (0 !== res) // first inequality wins
            return res
    }

    // compare array lengths
    return a.length - b.length
}

module.exports = {
    part01: function part01(input) {
        const pairs = parseInput(input)

        return sumOf(
            range(0, pairs.length).map(i =>
                (cmp(...pairs[i]) < 0) ? i + 1 : 0))
    },

    part02: function part02(input) {
        const rows = parseInput(input).flatMap(a => a)

        const dividers = [[[2]], [[6]]]
        rows.push(...dividers)

        rows.sort(cmp)

        return prodOf(
            dividers.map(div => rows.indexOf(div) + 1))
    }
}
