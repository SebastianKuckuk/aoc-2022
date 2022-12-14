function parseInput(input) {
    // return input.split('\n').map(row => row.split(',').flatMap(interval => interval.split('-').map(num => parseInt(num.toString()))))
    return input.split('\n').map(row => row.match(/(\d+)-(\d+),(\d+)-(\d+)/).slice(1, 5).map(num => parseInt(num.toString())))
}

module.exports = {
    part01: function part01(input) {
        const cond = ([a, b, x, y]) =>
            (a >= x && b <= y)      // first in second
            || (a <= x && b >= y)   // second in first
        return parseInput(input).filter(cond).length
    },

    part02: function part02(input) {
        const cond = ([a, b, x, y]) => // no chained comparisons -.-
            (x >= a && x <= b)      // second start in first
            || (y >= a && y <= b)   // second end in first
            || (a >= x && a <= y)   // first start in second
            || (b >= x && b <= y)   // second start in first
        return parseInput(input).filter(cond).length
    }
}
