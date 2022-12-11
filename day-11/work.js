const {range, prodOf} = require("../util");

function parseInput(input) {
    if ('dummy' === input)
        return [
            [
                [79, 98],
                a => a * 19,
                a => 0 === a % 23,
                2,
                3
            ],
            [
                [54, 65, 75, 74],
                a => a + 6,
                a => 0 === a % 19,
                2,
                0
            ],
            [
                [79, 60, 97],
                a => a * a,
                a => 0 === a % 13,
                1,
                3
            ],
            [
                [74],
                a => a + 3,
                a => 0 === a % 17,
                0,
                1
            ],
        ]

    return [
        [
            [52, 60, 85, 69, 75, 75],
            a => a * 17,
            a => 0 === a % 13,
            6,
            7
        ],
        [
            [96, 82, 61, 99, 82, 84, 85],
            a => a + 8,
            a => 0 === a % 7,
            0,
            7
        ],
        [
            [95, 79],
            a => a + 6,
            a => 0 === a % 19,
            5,
            3
        ],
        [
            [88, 50, 82, 65, 77],
            a => a * 19,
            a => 0 === a % 2,
            4,
            1
        ],
        [
            [66, 90, 59, 90, 87, 63, 53, 88],
            a => a + 7,
            a => 0 === a % 5,
            1,
            0
        ],
        [
            [92, 75, 62],
            a => a * a,
            a => 0 === a % 3,
            3,
            4
        ],
        [
            [94, 86, 76, 67],
            a => a + 1,
            a => 0 === a % 11,
            5,
            2
        ],
        [
            [57],
            a => a + 2,
            a => 0 === a % 17,
            6,
            2
        ]]
}

function play(monkeys, rounds, reduceWorry) {
    let inspections = Array(monkeys.length).fill(0)

    for (const round of range(0, rounds)) {
        for (const i in monkeys) {
            while (monkeys[i][0].length > 0) {
                let item = monkeys[i][0].shift()
                item = monkeys[i][1](item)
                item = reduceWorry(item)

                if (monkeys[i][2](item))
                    monkeys[monkeys[i][3]][0].push(item)
                else
                    monkeys[monkeys[i][4]][0].push(item)

                inspections[i]++
            }
        }

        // console.log(`After round ${round}:`)
        // for (const i in monkeys)
        //     console.log(`  Monkey ${i} holds ${monkeys[i][0]}`)
    }

    return inspections
}

module.exports = {
    part01: function part01(input) {
        let monkeys = parseInput(input)

        const inspections = play(monkeys, 20, item => Math.floor(item / 3))

        return prodOf(inspections.sort((a, b) => -(a - b)).slice(0, 2))
    },

    part02: function part02(input) {
        let monkeys = parseInput(input)

        const shift = ('dummy' === input) ? 13 * 17 * 19 * 23 : 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19
        const inspections = play(monkeys, 10_000, item => item - Math.floor(item / shift) * shift)

        return prodOf(inspections.sort((a, b) => -(a - b)).slice(0, 2))
    }
}
