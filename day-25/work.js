const {sumOf} = require("../util");

function parseInput(input) {
    const rows = input.split('\n')

    return rows.map(row => sumOf(row.split('').map((c, i) => {
        const shift = Math.pow(5, row.length - i - 1)
        if ('-' === c) return -1 * shift
        if ('=' === c) return -2 * shift
        return Number(c) * shift
    })))
}

module.exports = {
    part01: function part01(input) {
        let fuel = sumOf(parseInput(input))
        let snafu = []

        while (fuel > 0) { // n = i + 5 * (ii + 5 * (iii + 5 * (iiii ... )))
            let c = fuel % 5
            if (c > 2) c -= 5
            snafu.unshift(c)
            fuel = (fuel - c) / 5
        }

        snafu = snafu.map(c => {
            if (-1 === c) return '-'
            if (-2 === c) return '='
            return c.toString()
        }).join('')

        return snafu
    },

    part02: function part02(input) {
        return 'Merry Christmas'
    }
}
